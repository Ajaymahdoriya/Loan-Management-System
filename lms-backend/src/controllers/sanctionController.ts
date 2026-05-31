import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Loan from '../models/Loan';

export const getPendingLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'PENDING' }).populate('borrowerId', '-password');
    res.status(200).json(loans);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};

export const sanctionLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { loanId } = req.params;
    const { status, rejectionReason } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan || loan.status !== 'PENDING') return res.status(400).json({ error: "Loan is not pending" });

    loan.status = status;
    if (status === 'REJECTED') loan.rejectionReason = rejectionReason;
    
    await loan.save();
    res.status(200).json({ message: `Loan ${status.toLowerCase()}`, loan });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};