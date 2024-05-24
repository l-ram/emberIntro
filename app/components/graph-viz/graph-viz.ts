/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import sparql, {
  type D3ForceGraph,
  type GraphConfig,
} from 'intro/services/sparql';
import { tracked } from '@glimmer/tracking';
import d3 from 'd3';

export default class GraphVizComponent extends Component {
  @service declare sparql: sparql;
  @tracked graphData: D3ForceGraph | null = null;

  @tracked width = window.innerWidth;
  @tracked height = window.innerHeight;

  @action
  async fetchAndRenderGraph(query: string, config: GraphConfig) {
    try {
      const rawData = await this.sparql.fetchData(query);
      const graphData = this.sparql.relationshipGraph(rawData, config);
    } catch (error) {
      console.error('Error fetching or rendering graph data:', error);
    }
  }

  @action
  renderGraph(graphData: D3ForceGraph) {
    const svg = d3.select(this.element);

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
