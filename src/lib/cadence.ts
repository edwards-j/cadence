import type { ActivityType } from "./activity-types";

/**
 * Intensity multipliers for each activity type.
 *
 * These are the central tuning knobs of the Cadence Score.
 * Higher = more draining per hour of activity.
 *
 * Tune these based on real trip data after using the app.
 */
const TYPE_WEIGHTS: Record<ActivityType, number> = {
  transit: 1.5,
  physical: 2.0,
  sightseeing: 1.0,
  food: 0.5,
  nightlife: 1.3,
  rest: 0.2,
};

// A 12 hour day of mixed activities is hard bu completable
// A 14 hour day is about the max for most people
// This number will be tuned with use
const BRUTAL_DAY_THRESHOLD = 14;

const CADENCE_LABEL = {
  CHILL: "Chill",
  LIGHT: "Light",
  BALANCED: "Balanced",
  HEAVY: "Heavy",
  BRUTAL: "Brutal",
} as const;

type CadenceLabel = (typeof CADENCE_LABEL)[keyof typeof CADENCE_LABEL];

/**
 * The minimal shape of an activity needed for scoring.
 * Intentionally narrow — we don't need name, location, etc.
 */
export type ActivityForScoring = {
  type: ActivityType;
  durationHours: number;
};

/**
 * Calculates the Cadence Score for a single day.
 *
 * Maps weighted activity hours to a 0–10 intensity scale:
 *   0–3   Chill / rest day
 *   3–5   Light day
 *   5–7   Balanced day
 *   7–8.5 Heavy day
 *   8.5+  Brutal — likely to cause burnout
 *
 * @param activities — the day's activities (any objects with type + duration)
 * @returns score from 0 to 10, rounded to one decimal place
 */
export function calculateCadenceScore(
  activities: ActivityForScoring[],
): number {
  if (!activities.length) return 0;

  let weightedHours = 0;
  for (const activity of activities) {
    weightedHours += activity.durationHours * TYPE_WEIGHTS[activity.type];
  }

  // Convert weighted hours into a 0–10 scale by mapping the threshold to 10
  // So 14 weighted hours → score of 10.7 weighted hours → score of 5
  const rawScore = (weightedHours / BRUTAL_DAY_THRESHOLD) * 10;

  // Take whichever is smaller, 10 or the raw score
  // A 20 hour day and a 50 hour day all cap at 10
  // Without this, a marathon day would mess up the entire trips pacing curve
  const clampedScore = Math.min(10, rawScore);

  // Common pattern for rounding to one decimal place
  // 7.83 becomes 7.8, 4.05 becomes 4.1
  // Easier to read in the UI
  return Math.round(clampedScore * 10) / 10;
}

/**
 * Returns a short human label for a Cadence Score.
 * Used in UI to give the number context.
 */
export function cadenceLabel(score: number): CadenceLabel {
  if (score < 3) return CADENCE_LABEL.CHILL;
  if (score < 5) return CADENCE_LABEL.LIGHT;
  if (score < 7) return CADENCE_LABEL.BALANCED;
  if (score < 8.5) return CADENCE_LABEL.HEAVY;
  return CADENCE_LABEL.BRUTAL;
}
