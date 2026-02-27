// Score keys used in the personality + interest assessment
const SCORE_KEYS = ['O', 'C', 'E', 'A', 'N', 'TECH', 'ACAD', 'SPORT', 'ARTS', 'SOCIAL', 'GAMING', 'LEAD', 'ADV'];

// Weights for the composite similarity score
const WEIGHTS = {
  scores: 0.60,   // Personality + interest assessment (primary signal)
  goals:  0.25,   // Collaboration goal overlap
  major:  0.10,   // Same department
  gpa:    0.05,   // GPA proximity
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Euclidean-distance similarity across all 13 assessment score dimensions.
 * Returns 1.0 for identical profiles, approaching 0.0 for maximally different.
 */
function scoresSimilarity(scoresA, scoresB) {
  const a = scoresA || {};
  const b = scoresB || {};
  let sumSqDiff = 0;
  SCORE_KEYS.forEach(k => {
    const va = (a[k] != null) ? a[k] / 100 : 0;
    const vb = (b[k] != null) ? b[k] / 100 : 0;
    sumSqDiff += Math.pow(va - vb, 2);
  });
  // Max possible distance = sqrt(13) ≈ 3.606; normalise to [0,1]
  return 1 - Math.sqrt(sumSqDiff / SCORE_KEYS.length);
}

/**
 * Jaccard similarity on two arrays of strings (case-insensitive).
 */
function jaccardSimilarity(arrA, arrB) {
  const setA = new Set((arrA || []).map(s => s.toLowerCase().trim()));
  const setB = new Set((arrB || []).map(s => s.toLowerCase().trim()));
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function majorSimilarity(majorA, majorB) {
  return (majorA || '').toLowerCase().trim() === (majorB || '').toLowerCase().trim() ? 1 : 0;
}

/**
 * GPA proximity on a 0–10 scale.
 */
function gpaSimilarity(gpaA, gpaB) {
  return 1 - Math.abs((gpaA || 0) - (gpaB || 0)) / 10.0;
}

// ── Main export ───────────────────────────────────────────────────────────────

function computeSimilarity(studentA, studentB) {
  const scoresScore = scoresSimilarity(studentA.scores, studentB.scores);
  const goalsScore  = jaccardSimilarity(studentA.goals, studentB.goals);
  const majorScore  = majorSimilarity(studentA.major, studentB.major);
  const gpaScore    = gpaSimilarity(studentA.gpa, studentB.gpa);

  const composite =
    WEIGHTS.scores * scoresScore +
    WEIGHTS.goals  * goalsScore  +
    WEIGHTS.major  * majorScore  +
    WEIGHTS.gpa    * gpaScore;

  return {
    score: Math.round(composite * 100) / 100,
    breakdown: {
      scores: Math.round(scoresScore * 100),
      goals:  Math.round(goalsScore  * 100),
      major:  Math.round(majorScore  * 100),
      gpa:    Math.round(gpaScore    * 100),
    },
  };
}

module.exports = { computeSimilarity };