export type Role = 'Admin' | 'Sales' | 'Sanction' | 'Disbursement' | 'Collection' | 'Borrower';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: string;
}

export interface Loan {
  _id: string;
  borrowerId: string; // Can be string or populated User in frontend usage
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  amountPaid: number;
  status: 'PENDING' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'CLOSED';
  salarySlipUrl?: string;
  createdAt: string;
}
