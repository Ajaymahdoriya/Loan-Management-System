import { AuthRequest } from '../middlewares/auth';
import { Response } from 'express';
import User from '../models/User';
import Loan from '../models/Loan';
import { runBusinessRuleEngine } from '../utils/bre';
import { calculateRepayment } from '../utils/loanMath';

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    runBusinessRuleEngine(user); // Throws error if checks fail

    const { amount, tenure } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Salary slip is required" });

    const totalRepayment = calculateRepayment(Number(amount), Number(tenure));

    const loan = new Loan({
      borrowerId: user._id,
      amount: Number(amount),
      tenure: Number(tenure),
      salarySlipUrl: file.path,
      totalRepayment,
      status: 'PENDING'
    });

    await loan.save();
    res.status(201).json({ message: "Loan applied successfully", loan });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};