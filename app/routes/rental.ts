import Route from '@ember/routing/route';
import { service } from '@ember/service';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

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

export default class RentalRoute extends Route<IRentals> {
  @service store: any;

  async model(params: any) {
    return this.store.findRecord('rental', params.rental_id);
  }
}
