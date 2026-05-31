import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  utrNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);