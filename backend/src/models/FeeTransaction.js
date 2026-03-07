const mongoose = require('mongoose');

const feeTransactionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'completed' },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeTransaction', feeTransactionSchema);
