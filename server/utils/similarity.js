const WEIGHTS = { skills: 0.35, interests: 0.25, major: 0.25, gpa: 0.15 };

function jaccardSimilarity(arrA, arrB) {
  const setA = new Set(arrA.map(s => s.toLowerCase().trim()));
  const setB = new Set(arrB.map(s => s.toLowerCase().trim()));
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function majorSimilarity(majorA, majorB) {
  return majorA.toLowerCase().trim() === majorB.toLowerCase().trim() ? 1 : 0;
}

function gpaSimilarity(gpaA, gpaB) {
  return 1 - Math.abs(gpaA - gpaB) / 4.0;
}

function computeSimilarity(studentA, studentB) {
  const skillScore    = jaccardSimilarity(studentA.skills, studentB.skills);
  const interestScore = jaccardSimilarity(studentA.interests, studentB.interests);
  const majorScore    = majorSimilarity(studentA.major, studentB.major);
  const gpaScore      = gpaSimilarity(studentA.gpa, studentB.gpa);

  const composite =
    WEIGHTS.skills    * skillScore +
    WEIGHTS.interests * interestScore +
    WEIGHTS.major     * majorScore +
    WEIGHTS.gpa       * gpaScore;

  return {
    score: Math.round(composite * 100) / 100,
    breakdown: {
      skills:    Math.round(skillScore    * 100),
      interests: Math.round(interestScore * 100),
      major:     Math.round(majorScore    * 100),
      gpa:       Math.round(gpaScore      * 100),
    },
  };
}

module.exports = { computeSimilarity };