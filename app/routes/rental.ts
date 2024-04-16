import Route from "@ember/routing/route";

const COMMUNITY_CATEGORIES = ["Condo", "Townhouse", "Apartment"];

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
  async model(params: any) {
    console.log("p", params);
    let url = `/api/rentals/${params.rental_id as string}.json`;
    console.log(url);
    let response = await fetch(url);
    let { data } = await response.json();
    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = "Community";
    } else {
      type = "Standalone";
    }

    return {
      id,
      type,
      ...attributes,
    };
  }
}
