import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'], 
    default: 'Borrower' 
  },
  fullName: { type: String },
  pan: { type: String },
  dob: { type: Date },
  monthlySalary: { type: Number },
  employmentMode: { type: String, enum: ['Salaried', 'Self-Employed', 'Unemployed'] }
}, { timestamps: true });

// Remove 'next' from the arguments and just use 'return'
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model('User', userSchema);