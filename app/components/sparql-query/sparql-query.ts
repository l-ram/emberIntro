import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class SparqlQueryComponent extends Component {
  @service router!: RouterService;
  @tracked query = '';

  @action updateQuery(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
  }

  @action submitQuery() {
    this.router.transitionTo('index', { queryParams: { query: this.query } });
  }
}
