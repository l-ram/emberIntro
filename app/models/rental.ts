import Model, { attr } from '@ember-data/model';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export interface IRentalModel {
  title: string;
  owner: string;
  location: string;
  category: string;
  image: string;
  bedrooms: number;
  description: string;
}
export default class RentalModel extends Model implements IRentalModel {
  @attr title!: string;
  @attr owner!: string;
  @attr location!: string;
  @attr category!: string;
  @attr image!: string;
  @attr bedrooms!: number;
  @attr description!: string;

  get type() {
    if (COMMUNITY_CATEGORIES.includes(this.category)) {
      return 'Community';
    } else {
      return 'Standalone';
    }
  }
}
