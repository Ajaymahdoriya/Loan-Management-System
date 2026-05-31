import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Loan from '../models/Loan';

export const getSanctionedLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'SANCTIONED' }).populate('borrowerId', '-password');
    res.status(200).json(loans);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const disburseLoan = async (req: AuthRequest, res: Response) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan || loan.status !== 'SANCTIONED') return res.status(400).json({ error: "Loan not ready for disbursement" });

    loan.status = 'DISBURSED';
    await loan.save();
    res.status(200).json({ message: "Loan disbursed", loan });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};