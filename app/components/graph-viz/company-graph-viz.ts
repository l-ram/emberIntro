/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import sparql, { type D3ForceGraph, type Nodes } from 'intro/services/sparql';
import { tracked } from '@glimmer/tracking';
import d3 from 'd3';
import { inject as service } from '@ember/service';
import { attr } from '@ember-data/model';

interface CompanyGraphVizArgs {
  graphData: D3ForceGraph;
}

export default class CompanyGraphVizComponent extends Component<CompanyGraphVizArgs> {
  @service declare sparql: sparql;
  @tracked width = window.innerWidth;
  @tracked height = window.innerHeight;

  element!: HTMLElement;

  constructor(owner: unknown, args: CompanyGraphVizArgs) {
    super(owner, args);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  @action
  async setupGraph(element: HTMLElement) {
    this.element = element;
    try {
      const graphData = this.sparql.companyGraph();
      this.renderGraph(element, graphData);
    } catch (error) {
      console.error('Error fetching or rendering graph:', error);
    }
  }

  @action
  renderGraph(element: HTMLElement, graphData: D3ForceGraph) {
    console.log('Rendering graph...', graphData);
    const svg = d3.select(element);

    svg
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // COLOURS!!!
    const departmentColours = d3.scaleOrdinal(d3.schemeDark2);
    const managerColour = 'darkGrey';
    const seniorManagerColour = 'grey';

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
      .forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3.forceLink(graphData.links).id((d) => (d as Nodes).key as string),
      )
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

      const numberOfConnections = getConnectionsCount(
        d.key as string,
        graphData.links,
      );
      const radius = sizeScale(numberOfConnections);
      return radius;
    };

    const defs = svg.append('defs');

    graphData.nodes.forEach((d) => {
      defs
        .append('clipPath')
        .attr('id', `clip-path-${d.index}`)
        .append('circle')
        .attr('r', nodeSize(d))
        .attr('cx', 0)
        .attr('cy', 0);
    });

    const link = g
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', '#ccc')
      .attr('opacity', 0.5);

    const node = g
      .selectAll('node')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(drag(simulation as any) as any)
      .on('mouseover', function (d: Nodes) {
        link.attr('stroke', function (link) {
          return link.source.key === d.key || link.target.key === d.key
            ? 'black'
            : '#ccc';
        });
      })
      .on('mouseout', function () {
        link.attr('stroke', '#ccc');
      });

    node
      .append('circle')
      .attr('r', (d) => nodeSize(d))
      .style('stroke', 'black')
      .style('fill', (d) => {
        if (d.type === 'Manager') {
          return 'none';
        } else if (d.type === 'Senior Manager') {
          return seniorManagerColour;
        } else {
          return departmentColours(d.label as string);
        }
      })
      .style('stroke', 'darkGray')
      .style('stroke-width', 0.5)
      .style('stroke-width', (d) =>
        d.type === 'Manager' && 'Senior Manager' ? 2 : 0.5,
      )
      .on('mouseover', function () {
        d3.select(this).style('stroke', 'black');
        d3.select('image').style('stroke', 'black');
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke', 'darkGray');
      });

    // Manager images
    node
      .filter((d) => d.type === 'Manager')
      .append('svg:image')
      .attr('xlink:href', (d) => {
        return (d as Nodes).photo as string;
      })
      .attr('x', (d) => -nodeSize(d))
      .attr('y', (d) => -nodeSize(d))
      .attr('width', (d) => 2 * nodeSize(d))
      .attr('height', (d) => 2 * nodeSize(d))
      .attr('clip-path', (d) => `url(#clip-path-${d.index})`)
      .on('mouseover', function (d) {
        d3.select(this.parentNode).select('circle').style('stroke', 'black');
      })
      .on('mouseout', function () {
        d3.select(this.parentNode).select('circle').style('stroke', 'darkGray');
      });

    // Department labels
    node
      .append('text')
      .text((d) => {
        if (d.type === 'Manager') {
          return d.label as string;
        } else {
          return null;
        }
      })
      .attr('x', (d) => (d as Nodes).x as number)
      .attr('y', (d) => (d as Nodes).y as number)
      .style('font-size', '8px')
      .style('fill', 'black')
      .style('font-family', 'Arial');

    node.append('title').text((d) => d.key as string);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x as number)
        .attr('y1', (d) => d.source.y as number)
        .attr('x2', (d) => d.target.x as number)
        .attr('y2', (d) => d.target.y as number);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  }
}
