import Service from '@ember/service';
import type { SPARQLQuerySelectResultsJSON } from 'intro/routes';

declare module '@ember/service' {
  interface Registry {
    sparql: SparqlService;
  }
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

  relationshipGraph(data: SPARQLQuerySelectResultsJSON) {
    if (data) {
      const li = data;
      const hi = li.head;
      hi.vars.length;
    }
  }
}
