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
const companyJsonResults = {
  head: {
    vars: ['employee', 'position', 'manager', 'department'],
  },
  results: {
    bindings: [
      {
        employee: { type: 'uri', value: 'http://example.org/employees/1' },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'John Doe' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/2' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/3' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/4' },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'Alice Johnson' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/5' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'Finance' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/6' },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'Sarah Clark' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/7' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Robert Garcia' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/8' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Rebecca Martinez' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/9' },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'Daniel Wilson' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/10' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Elizabeth Thompson' },
        department: { type: 'literal', value: 'Finance' },
      },
      // 40 more entries...
      {
        employee: { type: 'uri', value: 'http://example.org/employees/49' },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'William White' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: { type: 'uri', value: 'http://example.org/employees/50' },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Laura Harris' },
        department: { type: 'literal', value: 'Bold' },
      },
      // 38 more entries...
    ],
  },
};

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

  companyGraph(config: GraphConfig): D3ForceGraph {
    const companyJsonresults = {
      head: {
        vars: ['employee', 'position', 'manager', 'department'],
      },
      results: {
        bindings: [
          {
            employee: { type: 'uri', value: 'http://example.org/employees/1' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'John Doe' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/2' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Jane Smith' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/3' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'David Johnson' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/4' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Alice Johnson' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/5' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Michael Brown' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/6' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Sarah Clark' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/7' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Robert Garcia' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/8' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Rebecca Martinez' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/9' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Daniel Wilson' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/10' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Elizabeth Thompson' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/49' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'William White' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/50' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Laura Harris' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/1' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'John Doe' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/2' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Jane Smith' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/3' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Jane Smith' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          // More entries for Data Visualization department...
          {
            employee: { type: 'uri', value: 'http://example.org/employees/14' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'John Doe' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/15' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/16' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'David Johnson' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/17' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Bold' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/1' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'John Doe' },
            department: { type: 'literal', value: 'Data Visualization' },
          },
          // Entries for Data Visualization department...

          {
            employee: { type: 'uri', value: 'http://example.org/employees/11' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/12' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'David Johnson' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/13' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Finance' },
          },
          // More entries for Finance department...

          {
            employee: { type: 'uri', value: 'http://example.org/employees/21' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Alice Johnson' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/22' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Michael Brown' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/23' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Alice Johnson' },
            department: { type: 'literal', value: 'HR' },
          },
          // More entries for HR department...

          {
            employee: { type: 'uri', value: 'http://example.org/employees/31' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Daniel Smith' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/32' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Emma Garcia' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/33' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Daniel Smith' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/11' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/12' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'David Johnson' },
            department: { type: 'literal', value: 'Finance' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/13' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Emily White' },
            department: { type: 'literal', value: 'Finance' },
          },
          // More entries for Finance department...

          {
            employee: { type: 'uri', value: 'http://example.org/employees/21' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Alice Johnson' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/22' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Michael Brown' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/23' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Alice Johnson' },
            department: { type: 'literal', value: 'HR' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/31' },
            position: { type: 'literal', value: 'Senior Manager' },
            manager: { type: 'literal', value: 'Daniel Smith' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/32' },
            position: { type: 'literal', value: 'Manager' },
            manager: { type: 'literal', value: 'Emma Garcia' },
            department: { type: 'literal', value: 'Security' },
          },
          {
            employee: { type: 'uri', value: 'http://example.org/employees/33' },
            position: { type: 'literal', value: 'Employee' },
            manager: { type: 'literal', value: 'Daniel Smith' },
            department: { type: 'literal', value: 'Security' },
          },
        ],
      },
    };
    config = config || {};

    const head: string[] = companyJsonresults.head.vars;
    const results = companyJsonresults.results.bindings;

    const nodeTypeMapping: { [key: string]: string } = {};

    head.forEach((head) => {
      nodeTypeMapping[head] = head;
    });
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
