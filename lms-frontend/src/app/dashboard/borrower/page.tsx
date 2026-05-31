'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  PlusCircle, FileText, CheckCircle, AlertCircle, 
  HelpCircle, Landmark, Calendar, Percent, ShieldAlert 
} from 'lucide-react';

interface LoanDetails {
  _id: string;
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  amountPaid: number;
  status: 'PENDING' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'CLOSED';
  salarySlipUrl?: string;
  createdAt: string;
}

export default function BorrowerDashboard() {
  const { user } = useAuth();
  
  const [amount, setAmount] = useState<number>(100000);
  const [tenure, setTenure] = useState<number>(90);
  const [salarySlip, setSalarySlip] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [appliedLoan, setAppliedLoan] = useState<LoanDetails | null>(null);

  const rate = 12;
  const simpleInterest = Math.round((amount * rate * tenure) / (365 * 100));
  const totalRepayment = amount + simpleInterest;
  const dailyEmi = Math.round(totalRepayment / tenure);

  const userDob = user?.dob ? new Date(user.dob) : null;
  let age: number | null = null;
  if (userDob) {
    const today = new Date();
    age = today.getFullYear() - userDob.getFullYear();
    const m = today.getMonth() - userDob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < userDob.getDate())) {
      age--;
    }
  }

  const isAgeValid = age !== null && age >= 23 && age <= 50;
  const isSalaryValid = user?.monthlySalary !== undefined && user.monthlySalary >= 25000;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = user?.pan ? panRegex.test(user.pan) : false;
  const isEmploymentValid = user?.employmentMode ? user.employmentMode !== 'Unemployed' : false;

  const isEligible = isAgeValid && isSalaryValid && isPanValid && isEmploymentValid;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSalarySlip(e.target.files[0]);
      setError(null);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salarySlip) {
      setError('Salary slip is required to complete the application.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('amount', amount.toString());
      formData.append('tenure', tenure.toString());
      formData.append('salarySlip', salarySlip);

      const response = await apiFetch('/borrower/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSuccess('Your loan application was successfully submitted and routed to the Sanction Desk!');
      setAppliedLoan(data.loan);
      
      setSalarySlip(null);
      
      const fileInput = document.getElementById('salarySlip') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Application failed. Please verify your profile guidelines.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
          <Landmark className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Welcome, {user?.fullName || user?.email.split('@')[0]}
          </h1>
          <p className="text-blue-100 font-medium text-sm md:text-base leading-relaxed">
            Apply for immediate short-term liquidity. Adjust your amount and tenure, upload your salary slip, and our automated Business Rule Engine will process your request in real time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-premium p-6 md:p-8">
          <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-slate-100">
            <PlusCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Apply for a New Loan</h2>
          </div>

          <form onSubmit={handleApply} className="space-y-6">
            {error && (
              <div className="flex items-start space-x-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium animate-fade-in">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Application Blocked:</span>
                  <p className="text-xs text-rose-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium animate-fade-in animate-pulse">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Submission Confirmed</span>
                  <p className="text-xs text-emerald-600 mt-1">{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Loan Amount</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-semibold">INR</span>
                  <input
                    type="number"
                    min="50000"
                    max="500000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>Min: ₹50,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Tenure (Days)</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-semibold">Days</span>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>Min: 30 Days</span>
                <span>Max: 365 Days</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Salary Slip Upload</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-all duration-150 cursor-pointer relative group">
                <input
                  type="file"
                  id="salarySlip"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <FileText className="h-10 w-10 text-slate-400 mb-3 group-hover:text-blue-500 transition-colors duration-150" />
                {salarySlip ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{salarySlip.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      {(salarySlip.size / 1024 / 1024).toFixed(2)} MB • Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Drag & drop your Salary Slip, or browser</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Submit Loan Request'
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-premium p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-50 rounded-bl-full opacity-50 -z-0"></div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Repayment Estimate</h3>
            <div className="space-y-5 relative z-10">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Principal Loan</span>
                <p className="text-2xl font-extrabold text-slate-800">₹{amount.toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
                    Interest Rate <Percent className="h-3 w-3 ml-0.5 text-blue-500" />
                  </span>
                  <p className="text-sm font-bold text-slate-800">12.00% p.a.</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
                    Interest Cost <span title="Calculated using standard Simple Interest (P * R * T)"><HelpCircle className="h-3 w-3 ml-0.5 text-slate-300" /></span>
                  </span>
                  <p className="text-sm font-bold text-slate-800">₹{simpleInterest.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 bg-slate-50/70 -mx-6 -mb-6 p-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Est. Daily Emi</span>
                  <p className="text-sm font-black text-slate-800">₹{dailyEmi.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-blue-500 uppercase block mb-0.5">Total Repayment</span>
                  <p className="text-base font-black text-blue-600">₹{totalRepayment.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-slate-900 rounded-full filter blur-3xl opacity-30"></div>
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Automated BRE Status
              </h3>
              {isEligible ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  Fully Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20 animate-pulse">
                  Blocked
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Age Limit (23 - 50)</span>
                  <span className="text-xs font-bold text-slate-200">
                    {age !== null ? `${age} Years Old` : 'Not Stated'}
                  </span>
                  {user?.dob && (
                    <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                      DOB: {new Date(user.dob).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  {isAgeValid ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-extrabold text-[10px] shrink-0 border border-rose-500/30">✕</div>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">{"Monthly Salary (>= ₹25k)"}</span>
                  <span className="text-xs font-bold text-slate-200">
                    {user?.monthlySalary !== undefined ? `₹${user.monthlySalary.toLocaleString('en-IN')}` : 'Not Stated'}
                  </span>
                </div>
                <div className="mt-1">
                  {isSalaryValid ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-extrabold text-[10px] shrink-0 border border-rose-500/30">✕</div>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">PAN Format (10-Digit)</span>
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                    {user?.pan || 'Not Stated'}
                  </span>
                </div>
                <div className="mt-1">
                  {isPanValid ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-extrabold text-[10px] shrink-0 border border-rose-500/30">✕</div>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Employment Status</span>
                  <span className="text-xs font-bold text-slate-200">
                    {user?.employmentMode || 'Not Stated'}
                  </span>
                </div>
                <div className="mt-1">
                  {isEmploymentValid ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-extrabold text-[10px] shrink-0 border border-rose-500/30">✕</div>
                  )}
                </div>
              </div>
            </div>

            {!isEligible && (
              <div className="mt-4 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-[11px] text-rose-300">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" /> Verification Blocked
                </p>
                Your profile fails one or more critical eligibility rules. Any loan request submitted will be blocked by the server-side Business Rule Engine.
              </div>
            )}
          </div>
        </div>
      </div>

      {appliedLoan && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-premium p-6 animate-fade-in">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-5">
            <CheckCircle className="h-5.5 w-5.5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">Active Applied Loan Details</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Loan Identifier</span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{appliedLoan._id}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Amount Requested</span>
              <span className="text-sm font-bold text-slate-800">₹{appliedLoan.amount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tenure / Rate</span>
              <span className="text-sm font-bold text-slate-800">{appliedLoan.tenure} Days / 12%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Processing Status</span>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 ring-1 ring-inset ring-amber-600/10 uppercase">
                {appliedLoan.status}
              </span>
            </div>
            {appliedLoan.salarySlipUrl && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Salary Slip</span>
                {
                  (() => {
                    const url = appliedLoan.salarySlipUrl as string;
                    // If already absolute, use it. Otherwise prefix with NEXT_PUBLIC_API_URL or current origin
                    const envBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
                    const fileUrl = url.startsWith('http') ? url : (envBase || (typeof window !== 'undefined' ? window.location.origin : '')) + (url.startsWith('/') ? url : `/${url}`);
                    return (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 underline truncate max-w-xs block">
                        {decodeURIComponent(url.split('/').pop() || url)}
                      </a>
                    );
                  })()
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
