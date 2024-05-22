/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';

export interface SPARQLQuerySelectResultsJSON {
  head: {
    vars: string[];
    link?: string[];
  };
  results: {
    bindings: BindingObject[];
    distinct: boolean;
    ordered: boolean;
  };
}

export type BindingObject =
  | IRIObject
  | LiteralObject
  | BlankNodeObject
  | TripleObject;

export interface SPARQLQueryAskResultsJSON {
  head: object;
  boolean: true;
}

export interface IRIObject {
  [key: string]: {
    type: "uri";
    value: string;
  };
}

export interface LiteralObject {
  [key: string]: {
    type: "literal";
    value: string;
    datatype?: string;
    xmlLang?: string;
    itsDir?: string;
  };
}

export interface BlankNodeObject {
  [key: string]: {
    type: "bnode";
    value: string;
  };
}

export interface TripleObject {
  [key: string]: {
    type: "triple";
    value: {
      subject: BindingObject;
      predicate: BindingObject;
      object: BindingObject;
    };
  };
}

export default class SparqlRoute extends Route {

  async model(params: { query: string }) {
    console.log(params.query)
    const url = "http://dbpedia.org/sparql";
    const response = await fetch(url + "?query=" + encodeURIComponent(params.query), {
      method: "GET",
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: "application/sparql-results+json",
      },
    });

    if (response.status !== 200) {
      return
    }

    const jsonData = await response.json() as Promise<SPARQLQuerySelectResultsJSON>;

    console.log("got data?:", jsonData);

    return jsonData;

  }
}
