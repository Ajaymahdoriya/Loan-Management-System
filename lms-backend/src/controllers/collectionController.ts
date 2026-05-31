import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Loan from '../models/Loan';
import Payment from '../models/Payment';

export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId, amount, utrNumber } = req.body;
    const loan = await Loan.findById(loanId);

    if (!loan || loan.status !== 'DISBURSED') return res.status(400).json({ error: "Loan is not active" });

    const payment = new Payment({ loanId, amount, utrNumber });
    await payment.save();

    loan.amountPaid += amount;
    if (loan.amountPaid >= loan.totalRepayment) loan.status = 'CLOSED';

    await loan.save();
    res.status(200).json({ message: "Payment recorded", status: loan.status });
  } catch (error: any) {
    if (error.code === 11000) return res.status(400).json({ error: "UTR Number must be unique" });
    res.status(500).json({ error: error.message });
  }
};