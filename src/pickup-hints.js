// UI learning history is separate from puzzle history: undo never refunds a hint.
export const PICKUP_HINT_DURATION = 2000;
export function claimPickupHint(counts, level) {
  // A changed editor layout is a new map even when it keeps its custom ID.
  const key = JSON.stringify([level.id, level.rows]);
  const stored = Object.hasOwn(counts, key) ? counts[key] : 0;
  const count = Number.isSafeInteger(stored) && stored > 0 ? stored : 0;
  if (count >= 2) return false;
  counts[key] = count + 1;
  return true;
}
