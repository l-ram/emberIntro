import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace: string = 'api';

  buildURL(...args: any): string {
    return `${super.buildURL(...args)}.json`;
  }
}
