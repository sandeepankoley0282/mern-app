const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name:   { type: String, required: [true, 'Name is required'], trim: true },
    age:    { type: Number, required: [true, 'Age is required'], min: 10, max: 100 },
    major:  { type: String, required: [true, 'Major/Department is required'], trim: true },
    gpa:    { type: Number, required: [true, 'GPA is required'], min: 0.0, max: 10.0 },
    year:   { type: Number, min: 1, max: 5 },
    gender: { type: String, trim: true },

    // Big Five + Interest scores (each 0–100)
    scores: {
      O:      { type: Number, default: 0 },  // Openness
      C:      { type: Number, default: 0 },  // Conscientiousness
      E:      { type: Number, default: 0 },  // Extraversion
      A:      { type: Number, default: 0 },  // Agreeableness
      N:      { type: Number, default: 0 },  // Neuroticism
      TECH:   { type: Number, default: 0 },
      ACAD:   { type: Number, default: 0 },
      SPORT:  { type: Number, default: 0 },
      ARTS:   { type: Number, default: 0 },
      SOCIAL: { type: Number, default: 0 },
      GAMING: { type: Number, default: 0 },
      LEAD:   { type: Number, default: 0 },
      ADV:    { type: Number, default: 0 },
    },

    // Collaboration goals selected by user
    goals: { type: [String], default: [] },

    // Legacy fields (kept for backward compatibility)
    skills:    { type: [String], default: [] },
    interests: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);