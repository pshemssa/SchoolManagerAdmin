const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  schedule: [{
    day: String,
    subject: String,
    startTime: String,
    endTime: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);
