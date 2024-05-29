/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/John_Doe',
        },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'None' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Jane_Smith',
        },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'John Doe' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Alice_Walker',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Bob_Jackson',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Carol_White',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/David_Hall',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Emma_Moore',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Frank_Clark',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Grace_Lewis',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Henry_Walker',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Jane Smith' },
        department: { type: 'literal', value: 'Data Visualization' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Emily_White',
        },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'None' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/David_Johnson',
        },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Emily White' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Irene_Jones',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Jack_Miller',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Karen_Wilson',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Liam_Moore',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Megan_Taylor',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Noah_Anderson',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Olivia_Thomas',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Paul_Harris',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Queen_Jackson',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'David Johnson' },
        department: { type: 'literal', value: 'Bold' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Alice_Johnson',
        },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'None' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Michael_Brown',
        },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Alice Johnson' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Robert_Davis',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Sarah_Martin',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Thomas_Lee',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Uma_Clark',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Victor_Rodriguez',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/William_Lewis',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Xena_White',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Yasmin_Hall',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Zack_Wright',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Michael Brown' },
        department: { type: 'literal', value: 'HR' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Daniel_Smith',
        },
        position: { type: 'literal', value: 'Senior Manager' },
        manager: { type: 'literal', value: 'None' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Edward_Scissorhands',
        },
        position: { type: 'literal', value: 'Manager' },
        manager: { type: 'literal', value: 'Daniel Smith' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Daniel_Smith',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Edward Scissorhands' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Jamie_Chunks',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Edward Scissorhands' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Clarissa_Coombs',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Edward Scissorhands' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Petunia_Rivers',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Edward Scissorhands' },
        department: { type: 'literal', value: 'Security' },
      },
      {
        employee: {
          type: 'uri',
          value: 'http://example.org/employees/Crystal_Bell',
        },
        position: { type: 'literal', value: 'Employee' },
        manager: { type: 'literal', value: 'Edward Scissorhands' },
        department: { type: 'literal', value: 'Security' },
      },
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

  companyGraph(config?: GraphConfig): D3ForceGraph {
    const head: string[] = companyJsonResults.head.vars;
    const results = companyJsonResults.results.bindings;

    const nodeTypeMapping: { [key: string]: string } = {};

    head.forEach((head) => {
      nodeTypeMapping[head] = head;
    });

    const opts = {
      employee: 'employee',
      position: 'position',
      manager: 'manager',
      department: 'department',
    };
    const graph: D3ForceGraph = {
      nodes: [],
      links: [],
    };
    const check = new Map();
    let index = 0;

    for (let i = 0; i < results.length; i++) {
      // @ts-expect-error
      const employeeUri = results[i][opts.employee].value;
      // @ts-expect-error
      const position = results[i][opts.position].value;
      // @ts-expect-error
      const manager = results[i][opts.manager].value;
      // @ts-expect-error
      const department = results[i][opts.department].value;

      const employee = employeeUri.split('/').pop();

      if (!check.has(employee)) {
        graph.nodes.push({
          key: employee,
          type: position,
          value: manager,
          label: department,
        });
        check.set(employee, index);
        index++;
      }
    }

    console.log(check);

    for (let i = 0; i < results.length; i++) {
      const employeeUri = results[i][opts.employee].value;
      const managerUri = results[i][opts.manager].value;

      const employee = employeeUri.split('/').pop();
      const manager =
        managerUri !== 'None' ? managerUri.split('/').pop() : null;

      if (manager && check.has(manager)) {
        graph.links.push({
          source: check.get(manager),
          target: check.get(employee),
        });
      }
    }
    return graph;
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
      // @ts-expect-error
      const key1 = results[i][opts.key1].value;
      // @ts-expect-error
      const key2 = results[i][opts.key2].value;
      const label1 =
        opts.label1 &&
          typeof opts.label1 === 'string' &&
          // @ts-expect-error
          results[i][opts.label1]
          ? // @ts-expect-error
          results[i][opts.label1].value
          : key1;
      const label2 =
        opts.label2 &&
          typeof opts.label2 === 'string' &&
          // @ts-expect-error
          results[i][opts.label2]
          ? // @ts-expect-error
          results[i][opts.label2].value
          : key2;
      const value1 =
        opts.value1 &&
          typeof opts.value1 === 'string' &&
          // @ts-expect-error
          results[i][opts.value1]
          ? // @ts-expect-error
          results[i][opts.value1].value
          : false;
      const value2 =
        opts.value2 &&
          typeof opts.value2 === 'string' &&
          // @ts-expect-error
          results[i][opts.value2]
          ? // @ts-expect-error
          results[i][opts.value2].value
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
