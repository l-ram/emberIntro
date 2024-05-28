/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import sparql, { type D3ForceGraph, type Nodes } from 'intro/services/sparql';
import { tracked } from '@glimmer/tracking';
import d3 from 'd3';
import { inject as service } from '@ember/service';

interface GraphVizArgs {
  graphData: D3ForceGraph;
}

export default class GraphVizComponent extends Component<GraphVizArgs> {
  @service declare sparql: sparql;
  @tracked graphData!: D3ForceGraph | null;
  @tracked width = window.innerWidth;
  @tracked height = window.innerHeight;

  element!: HTMLElement;

  constructor(owner: unknown, args: GraphVizArgs) {
    super(owner, args);
    this.graphData = args.graphData;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    console.log('GraphVizComponent args:', args);
  }

  @action
  async setupGraph(element: HTMLElement) {
    this.element = element;
    try {

      const rawData = await this.sparql.fetchData(
        `        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?person ?personLabel ?position ?positionLabel ?organization ?organizationLabel
        WHERE {
          ?person rdf:type dbo:Person .
          ?person dbo:position ?position .
          ?person dbo:organisation ?organization .

          OPTIONAL { ?person rdfs:label ?personLabel . FILTER (lang(?personLabel) = "en") }
          OPTIONAL { ?position rdfs:label ?positionLabel . FILTER (lang(?positionLabel) = "en") }
          OPTIONAL { ?organization rdfs:label ?organizationLabel . FILTER (lang(?organizationLabel) = "en") }
        }
        LIMIT 100`,

        // `SELECT ?book ?author ?abstract
        //       WHERE {
        //         ?book a dbo:Book .
        //         ?book dbo:author ?author .
        //         ?book dbo:abstract ?abstract .
        //         FILTER (lang(?abstract) = 'en')
        //       }
        //       LIMIT 10`
      );
      console.log('json data:', rawData);
      const graphData = this.sparql.relationshipGraph(rawData, {});
      this.renderGraph(element, graphData);
    } catch (error) {
      console.error('Error fetching or rendering graph:', error);
    }
  }

  @action
  renderGraph(element: HTMLElement, graphData: D3ForceGraph) {
    console.log('Rendering graph...', graphData);
    const svg = d3.select(element);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    const colours = d3.schemeSet2;
    const colour = d3.scaleOrdinal(colours);

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const drag = (simulation: d3.Simulation<any, undefined>) => {
      const dragStarted = (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      };

      const dragged = (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      };

      const dragended = (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      };

      return d3
        .drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    // Max count
    const nodeKeyCounts: { [key: string]: number } = {};
    graphData.links.forEach((link) => {
      const sourceKey = link.source.key;
      const targetKey = link.target.key;
      nodeKeyCounts[sourceKey] = (nodeKeyCounts[sourceKey] || 0) + 1;
      nodeKeyCounts[targetKey] = (nodeKeyCounts[targetKey] || 0) + 1;
    });

    // Find the maximum count
    let maxCount = 0;
    let mostFrequentKeys: string[] = [];

    Object.entries(nodeKeyCounts).forEach(([key, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentKeys = [key];
      } else if (count === maxCount) {
        mostFrequentKeys.push(key);
      }
    });

    console.log('most:', mostFrequentKeys);

    console.log(
      `The node key(s) "${mostFrequentKeys.join(
        ', ',
      )}" appear(s) ${maxCount} times.`,
    );

    const getConnectionsCount = (nodeKey: string, links: any) => {
      let connectionsCount = 0;
      links.forEach((link: any) => {
        if (link.source.key === nodeKey || link.target.key === nodeKey) {
          connectionsCount++;
        }
      });
      return connectionsCount;
    };

    const nodeSize = (d: Nodes): number => {
      const sizeScale = d3.scaleLinear().domain([0, maxCount]).range([2, 10]);

      const numberOfConnections = getConnectionsCount(d.key, graphData.links);
      const radius = sizeScale(numberOfConnections);
      return radius;
    };

    const link = g
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', '#ccc')
      .attr('opacity', 0.5);

    const node = g
      .selectAll('circle')
      .data(graphData.nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => nodeSize(d))
      .style('fill', (d) => colour(d.type))
      .join('circle')
      .call(drag(simulation as any) as any);

    node.append('title').text((d) => d.key);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x as number)
        .attr('y1', (d) => d.source.y as number)
        .attr('x2', (d) => d.target.x as number)
        .attr('y2', (d) => d.target.y as number);

      node.attr('cx', (d) => d.x as number).attr('cy', (d) => d.y as number);
    });

    svg
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }
}
