import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AccountRoute extends Route {
  @service store: any;

  async model() {
    return this.store.findAll('account');
  }
}
