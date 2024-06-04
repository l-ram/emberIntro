/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type sparql from 'intro/services/sparql';

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
      subject: string;
      predicate: string;
      object: string;
    };
  };
};

export default class SparqlRoute extends Route {
  @service declare sparql: sparql

  queryParams = {
    query: {
      refreshModel: true,
    }
  };

  async model(params: { query: string }) {
    if (!params.query) {
      return;
    }

    console.log(params.query);

    const jsonData = await this.sparql.fetchData(params.query);
    const graphData = this.sparql.relationshipGraph(jsonData, {});
    console.log('Route model:', graphData);
    const querySample = `SELECT ?book ?author ?abstract
    WHERE {
      ?book a dbo:Book .
      ?book dbo:author ?author .
      ?book dbo:abstract ?abstract .
      FILTER (lang(?abstract) = 'en')
    }
    LIMIT 10
    `

    return {
      graphData,
      querySample
    };
  }
}
