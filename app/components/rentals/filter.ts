import Component from '@glimmer/component';
import type { IRentalModel } from 'intro/models/rental';

interface IRentalsFilter {
  query: string;
  rentals: IRentalModel[];
}

export default class RentalsFilterComponent extends Component<IRentalsFilter> {
  get results() {
    let { rentals, query } = this.args;

    if (query) {
      rentals = rentals.filter((rental) => rental.title.includes(query));
    }

    return rentals;
  }
}
