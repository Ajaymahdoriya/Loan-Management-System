import express from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/auth';
import { uploadSalarySlip } from '../middlewares/upload';

import { registerBorrower, login, getCurrentUser } from '../controllers/authController';
import { applyLoan } from '../controllers/borrowerController';
import { getSalesLeads } from '../controllers/salesController';
import { getPendingLoans, sanctionLoan } from '../controllers/sanctionController';
import { getSanctionedLoans, disburseLoan } from '../controllers/disbursementController';
import { recordPayment } from '../controllers/collectionController';

const router = express.Router();

// Auth
router.post('/auth/register', registerBorrower);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getCurrentUser);

// Borrower
router.post('/borrower/apply', verifyToken, authorizeRoles('Borrower'), uploadSalarySlip.single('salarySlip'), applyLoan);

// Dashboard (RBAC Protected)
router.get('/dashboard/sales/leads', verifyToken, authorizeRoles('Sales'), getSalesLeads);
router.get('/dashboard/sanction/pending', verifyToken, authorizeRoles('Sanction'), getPendingLoans);
router.put('/dashboard/sanction/:loanId', verifyToken, authorizeRoles('Sanction'), sanctionLoan);
router.get('/dashboard/disbursement/sanctioned', verifyToken, authorizeRoles('Disbursement'), getSanctionedLoans);
router.put('/dashboard/disbursement/:loanId', verifyToken, authorizeRoles('Disbursement'), disburseLoan);
router.post('/dashboard/collection/payment', verifyToken, authorizeRoles('Collection'), recordPayment);

export default router;