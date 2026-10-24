// Revised layouts have new IDs; old completions stay saved but cannot mark them solved.
export function selectedCollection(saved) {
  return saved.collection === 'challenge' ? 'challenge' : 'regular';
}
export function roomIndex(saved, collection, levels) {
  const id = saved[collection + 'RoomId'];
  const index = levels.findIndex(level => level.id === id);
  if (index >= 0) return index;
  // An unknown explicit ID belongs to a removed room, not the same numbered room.
  if (id || (collection === 'regular' && saved.collection !== 'regular')) return 0;
  const oldIndex = saved[collection + 'Current'];
  return Number.isInteger(oldIndex) ? Math.max(0, Math.min(levels.length - 1, oldIndex)) : 0;
}
