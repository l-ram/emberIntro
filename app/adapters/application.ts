import JSONAPIAdapter from "@ember-data/adapter/json-api";
import DS from "ember-data";

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace: string = "api";

  buildURL(...args: any): string {
    return `${super.buildURL(...args)}.json`;
  }
}
