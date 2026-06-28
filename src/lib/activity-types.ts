export const ACTIVITY_TYPES = [
  "transit",
  "physical",
  "sightseeing",
  "food",
  "nightlife",
  "rest",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/**
 * Display metadata for each activity type. Mirrors the Aperture spec:
 * weight feeds the Cadence score, glyph + color drive the UI.
 *
 * Weights are also the source of truth in `lib/cadence.ts` — keep them
 * here so the UI and scoring agree on what each type "costs".
 */
export type ActivityTypeMeta = {
  type: ActivityType;
  label: string;
  glyph: string;
  color: string;
  /** Multiplier applied to durationHours when scoring. */
  weight: number;
};

export const ACTIVITY_TYPE_META: Record<ActivityType, ActivityTypeMeta> = {
  transit: {
    type: "transit",
    label: "Transit",
    glyph: "↗",
    color: "#60a5fa",
    weight: 1.5,
  },
  physical: {
    type: "physical",
    label: "Physical",
    glyph: "▲",
    color: "#fb7185",
    weight: 2.0,
  },
  sightseeing: {
    type: "sightseeing",
    label: "Sights",
    glyph: "◆",
    color: "#a78bfa",
    weight: 1.0,
  },
  food: {
    type: "food",
    label: "Food",
    glyph: "●",
    color: "#34d399",
    weight: 0.5,
  },
  nightlife: {
    type: "nightlife",
    label: "Nightlife",
    glyph: "◐",
    color: "#f472b6",
    weight: 1.3,
  },
  rest: {
    type: "rest",
    label: "Rest",
    glyph: "—",
    color: "#94a3b8",
    weight: 0.2,
  },
};

/** Next type in the cycling order — used by the tap-glyph affordance. */
export function nextActivityType(t: ActivityType): ActivityType {
  const i = ACTIVITY_TYPES.indexOf(t);
  return ACTIVITY_TYPES[(i + 1) % ACTIVITY_TYPES.length];
}
