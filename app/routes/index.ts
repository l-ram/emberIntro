import Route from '@ember/routing/route';
import { service } from '@ember/service';

interface IRentals {
  id: string;
  type: string;
  title: string;
  owner: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  category: string;
  bedrooms: number;
  image: string;
  description: string;
}

export default class IndexRoute extends Route<IRentals> {
  @service store: any;

  async model() {
    return this.store.findAll('rental');
  }
}
