export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface TripData {
  id: string;
  picks: Location[];
  scale: "small" | "medium" | "large";
  drop: Location;
  payout: {
    amount: number;
    currency: string;
  }
  stats: {
    time: number;
    distance: number;
  };
}

