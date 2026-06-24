export const ACTIVITY_TYPES = [
  "transit",
  "physical",
  "sightseeing",
  "food",
  "nightlife",
  "rest",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
