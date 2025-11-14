export interface Travel {
  id: string;
  city: string;
  country: string;
  year: number;
  type: 'Y' | 'N';
  image: string;
  description: string;
  highlights: string;
  activities: string;
  foods: {
    dish: string;
    place: string;
  }[];
  rating: number;
}
