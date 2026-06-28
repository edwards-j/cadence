import { ACTIVITY_TYPE_META, type ActivityType } from "./activity-types";

// A 12 hour day of mixed activities is hard but completable
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

export type CadenceResult = {
  score: number;
  bucket: CadenceBucket;
  label: string;
  color: string;
};

export function cadenceBucket(score: number): CadenceResult {
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
 *   0–2   Chill / rest day
 *   2–4   Light day
 *   4–6   Balanced day
 *   6–8   Heavy day
 *   8+    Brutal — likely to cause burnout
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
    weightedHours +=
      activity.durationHours * ACTIVITY_TYPE_META[activity.type].weight;
  }

  // Convert weighted hours into a 0–10 scale by mapping the threshold to 10
  const rawScore = (weightedHours / BRUTAL_DAY_THRESHOLD) * 10;

  // Cap at 10 so a marathon day doesn't blow out the whole trip's curve
  const clampedScore = Math.min(10, rawScore);

  // Round to one decimal — easier to read in the UI
  return Math.round(clampedScore * 10) / 10;
}

/** Average score across a list of days. 0 if empty. */
export function averageScore(scores: number[]): number {
  if (!scores.length) return 0;
  const s = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(s * 10) / 10;
}

/** Highest score in a list of days. 0 if empty. */
export function peakScore(scores: number[]): number {
  if (!scores.length) return 0;
  return Math.max(...scores);
}

/** Total duration in hours. */
export function totalHours(activities: ActivityForScoring[]): number {
  return activities.reduce((s, a) => s + a.durationHours, 0);
}
