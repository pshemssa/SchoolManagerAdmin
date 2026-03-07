const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  feeBalance: { type: Number, default: 0 },
  grades: [{
    subject: String,
    grade: String,
    marks: Number,
    date: { type: Date, default: Date.now }
  }],
  attendance: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
