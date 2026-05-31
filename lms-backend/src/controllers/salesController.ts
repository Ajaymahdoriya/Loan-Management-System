import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Loan from '../models/Loan';

export const getSalesLeads = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find().distinct('borrowerId');
    const leads = await User.find({ role: 'Borrower', _id: { $nin: loans } }).select('-password');
    res.status(200).json(leads);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};