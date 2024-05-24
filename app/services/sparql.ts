import d3 from 'd3';
import Service from '@ember/service';
import type { SPARQLQuerySelectResultsJSON } from 'intro/routes';

declare module '@ember/service' {
  interface Registry {
    sparql: SparqlService;
  }
}

export interface D3ForceGraph {
  nodes: Nodes[];
  links: Links[];
}

export interface Nodes extends d3.SimulationNodeDatum {
  key: string;
  label: string;
  value: boolean;
  level?: number | null;
  type: string;
}

export interface Links extends d3.SimulationLinkDatum<Nodes> {
  source: Nodes;
  target: Nodes;
}

export interface GraphConfig {
  key1?: string;
  key2?: string;
  label1?: string | false;
  label2?: string | false;
  value1?: string | false;
  value2?: string | false;
  type?: string;
}

export default class SparqlService extends Service {
  async fetchData(query: string): Promise<SPARQLQuerySelectResultsJSON> {
    const url = `http://dbpedia.org/sparql?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/sparql-query',
        Accept: 'application/sparql-results+json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return (await response.json()) as Promise<SPARQLQuerySelectResultsJSON>;
  }

  relationshipGraph(
    data: SPARQLQuerySelectResultsJSON,
    config: GraphConfig,
  ): D3ForceGraph {
    config = config || {};

    const head: string[] = data.head.vars;
    const results = data.results.bindings;

    const nodeTypeMapping: { [key: string]: string } = {};

    head.forEach((head) => {
      nodeTypeMapping[head] = head;
    });

    const opts = {
      key1: config.key1 || head[0] || 'key1',
      key2: config.key2 || head[1] || 'key2',
      label1: config.label1 || head[2] || false,
      label2: config.label2 || head[3] || false,
      value1: config.value1 || head[4] || false,
      value2: config.value2 || head[5] || false,
    };
    const graph: D3ForceGraph = {
      nodes: [],
      links: [],
    };
    const check = new Map();
    let index = 0;

    for (let i = 0; i < results.length; i++) {
      const key1 = results[i][opts.key1].value;
      const key2 = results[i][opts.key2].value;
      const label1 =
        opts.label1 &&
          typeof opts.label1 === 'string' &&
          results[i][opts.label1]
          ? results[i][opts.label1].value
          : key1;
      const label2 =
        opts.label2 &&
          typeof opts.label2 === 'string' &&
          results[i][opts.label2]
          ? results[i][opts.label2].value
          : key2;
      const value1 =
        opts.value1 &&
          typeof opts.value1 === 'string' &&
          results[i][opts.value1]
          ? results[i][opts.value1].value
          : false;
      const value2 =
        opts.value2 &&
          typeof opts.value2 === 'string' &&
          results[i][opts.value2]
          ? results[i][opts.value2].value
          : false;

      const type1 = nodeTypeMapping[opts.key1] || 'unknown';
      const type2 = nodeTypeMapping[opts.key2] || 'unknown';

      if (!check.has(key1)) {
        graph.nodes.push({
          key: key1 as string,
          label: label1 as string,
          value: value1 as boolean,
          type: type1,
        });
        check.set(key1, index);
        index++;
      }
      if (!check.has(key2)) {
        graph.nodes.push({
          key: key2 as string,
          label: label2 as string,
          value: value2 as boolean,
          type: type2,
        });
        check.set(key2, index);
        index++;
      }
      graph.links.push({ source: check.get(key1), target: check.get(key2) });
    }
    return graph;
  }
}
