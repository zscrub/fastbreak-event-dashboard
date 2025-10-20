export type EventVenueLink = {
  venue_id?: string;
  venues: {
    name: string;
    city?: string | null;
  }[];
};

export type EventWithVenues = {
  id: string;
  name: string;
  sport_type: string;
  starts_at: string;
  description?: string | null;
  owner_id: string;
  event_venues?: EventVenueLink[];
};
