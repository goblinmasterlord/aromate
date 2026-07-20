// pathSupply.js
// Answers "can the catalog actually serve this combination?" — used for
// soft inline warnings in the quiz (never to disable choices) and for the
// thin-path banner on the results page.

import { perfumes } from '../data/perfumes';
import { noteMatchesLabel } from './noteMatching';

const inSeason = (perfume, season) =>
  perfume.season.includes(season) || perfume.season.includes('all');

// How many perfumes of this type are wearable in this season.
export const typeSeasonCount = (type, season) =>
  perfumes.filter(p => p.type === type && inSeason(p, season)).length;

// Does any perfume wearable in this season contain the note?
// Season-only on purpose: type pools are small enough that flagging against
// them would mark half the picker; season conflicts (Oud in summer, Marine
// Notes in winter) are the ones users actually feel.
export const noteAvailableInSeason = (label, season) => {
  const pool = season ? perfumes.filter(p => inSeason(p, season)) : perfumes;
  return pool.some(p =>
    [...p.notes.top, ...p.notes.middle, ...p.notes.base].some(n => noteMatchesLabel(n, label))
  );
};
