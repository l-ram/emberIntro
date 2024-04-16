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

export default class IndexRoute extends Route<IRentals> {
  async model() {
    let response = await fetch("/api/rentals.json");
    let { data } = await response.json();
    const cleaned = data.map((model: any) => {
      let { id, attributes } = model;
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
    });
    console.log("clean", cleaned);
    return cleaned;
  }
}
