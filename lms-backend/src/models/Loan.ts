import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salarySlipUrl: { type: String, required: true },
  amount: { type: Number, required: true, min: 50000, max: 500000 },
  tenure: { type: Number, required: true, min: 30, max: 365 },
  interestRate: { type: Number, default: 12 },
  totalRepayment: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['PENDING', 'SANCTIONED', 'REJECTED', 'DISBURSED', 'CLOSED'], 
    default: 'PENDING' 
  },
  rejectionReason: { type: String }
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);