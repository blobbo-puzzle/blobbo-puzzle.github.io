// Stable room IDs keep completion records valid when the playing order changes.
export const CAMPAIGN_ORDER = [
  'campaign-03', 'campaign-13', 'campaign-09', 'campaign-21', 'campaign-22',
  'campaign-02', 'campaign-20', 'campaign-07', 'campaign-12', 'campaign-10',
  'campaign-17', 'campaign-16', 'campaign-18', 'campaign-14', 'campaign-15',
  'campaign-01', 'campaign-11', 'campaign-06', 'campaign-08', 'campaign-19',
];

export const LEGACY_CAMPAIGN_ORDER = [
  'campaign-01', 'campaign-02', 'campaign-03', 'campaign-07', 'campaign-19',
  'campaign-08', 'campaign-10', 'campaign-14', 'campaign-18', 'campaign-09',
  'campaign-13', 'campaign-21', 'campaign-12', 'campaign-11', 'campaign-06',
  'campaign-16', 'campaign-17', 'campaign-15', 'campaign-22', 'campaign-20',
];

export function campaignIndex(saved, levels) {
  let id = saved.campaignRoomId;
  if (!id && Number.isInteger(saved.campaignCurrent)) id = LEGACY_CAMPAIGN_ORDER[saved.campaignCurrent];
  const index = levels.findIndex(level => level.id === id);
  return index < 0 ? 0 : index;
}
