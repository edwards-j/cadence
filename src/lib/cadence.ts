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

/**
 * The minimal shape of an activity needed for scoring.
 * Intentionally narrow — we don't need name, location, etc.
 */
export type ActivityForScoring = {
  type: ActivityType;
  durationHours: number;
};

export type CadenceBucket = "chill" | "light" | "balanced" | "heavy" | "brutal";

export function scoreToBucket(score: number): CadenceBucket {
  if (score >= 8) return "brutal";
  if (score >= 6) return "heavy";
  if (score >= 4) return "balanced";
  if (score >= 2) return "light";
  return "chill";
}

export function bucketLabel(bucket: CadenceBucket): string {
  switch (bucket) {
    case "chill":
      return "Chill";
    case "light":
      return "Light";
    case "balanced":
      return "Balanced";
    case "heavy":
      return "Heavy";
    case "brutal":
      return "Brutal";
  }
}

export function bucketColor(bucket: CadenceBucket): string {
  switch (bucket) {
    case "chill":
      return "var(--color-cadence-chill)";
    case "light":
      return "var(--color-cadence-light)";
    case "balanced":
      return "var(--color-cadence-balanced)";
    case "heavy":
      return "var(--color-cadence-heavy)";
    case "brutal":
      return "var(--color-cadence-brutal)";
  }
}

export function cadenceBucket(score: number): {
  score: number;
  bucket: CadenceBucket;
  label: string;
  color: string;
} {
  const bucket = scoreToBucket(score);
  return {
    score,
    bucket,
    label: bucketLabel(bucket),
    color: bucketColor(bucket),
  };
}

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
