const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    age: { type: Number, required: [true, 'Age is required'], min: 10, max: 100 },
    major: { type: String, required: [true, 'Major/Department is required'], trim: true },
    gpa: { type: Number, required: [true, 'GPA is required'], min: 0.0, max: 4.0 },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);