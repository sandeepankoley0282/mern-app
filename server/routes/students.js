const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { computeSimilarity } = require('../utils/similarity');

router.post('/', async (req, res) => {
  try {
    const { name, age, major, gpa, skills, interests } = req.body;
    const student = new Student({
      name, age: Number(age), major, gpa: parseFloat(gpa),
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      interests: Array.isArray(interests) ? interests : interests ? interests.split(',').map(s => s.trim()).filter(Boolean) : [],
    });
    const saved = await student.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id/similar', async (req, res) => {
  try {
    const target = await Student.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, error: 'Student not found' });
    const limit = Math.min(parseInt(req.query.limit) || 5, 20);
    const others = await Student.find({ _id: { $ne: target._id } });
    const ranked = others
      .map(other => { const { score, breakdown } = computeSimilarity(target, other); return { student: other, score, breakdown }; })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    res.json({ success: true, target, results: ranked });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;