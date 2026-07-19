// noteMatching.js
// Token-based matching between user-selected note labels and the free-form
// note names in the perfume database. Token matching avoids the substring
// false positives the old engine had ("Rose" matching "rosemary",
// "Pine" matching "pineapple", "Oak" matching "oakmoss").

import { noteMatchTerms, noteCategoryOf, noteCategories } from '../data/fragranceNotes';

const tokenize = (str) =>
  String(str)
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

// A term matches a perfume note when every token of the term appears
// among the note's tokens: "lemon" matches "sicilian lemon" but
// "rose" does not match "rosemary".
export const termMatchesNote = (term, perfumeNote) => {
  const noteTokens = tokenize(perfumeNote);
  return tokenize(term).every(t => noteTokens.includes(t));
};

const matchTermsFor = (label) => noteMatchTerms[label] || [label];

// Does this perfume note match the selected label (directly)?
export const noteMatchesLabel = (perfumeNote, label) =>
  matchTermsFor(label).some(term => termMatchesNote(term, perfumeNote));

// All match terms of the label's category — used for family (partial) credit.
export const familyTermsFor = (label) => {
  const category = noteCategoryOf[label];
  if (!category) return [];
  return noteCategories[category].flatMap(n => n.match);
};

export const noteMatchesFamily = (perfumeNote, label) =>
  familyTermsFor(label).some(term => termMatchesNote(term, perfumeNote));
