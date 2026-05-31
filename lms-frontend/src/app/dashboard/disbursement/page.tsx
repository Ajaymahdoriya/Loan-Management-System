'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Coins, FileText, Check, AlertCircle, CheckCircle2, 
  RefreshCw, Clipboard, ExternalLink, Send 
} from 'lucide-react';

interface PopulatedBorrower {
  _id: string;
  email: string;
  fullName: string;
}

interface Loan {
  _id: string;
  borrowerId: PopulatedBorrower | string;
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  amountPaid: number;
  status: 'PENDING' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'CLOSED';
  salarySlipUrl?: string;
  createdAt: string;
}

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Custom manual input box states
  const [manualLoanId, setManualLoanId] = useState('');

  // Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSanctionedLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/dashboard/disbursement/sanctioned');
      const data = await response.json();
      setLoans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sanctioned applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanctionedLoans();
  }, []);

  const handleDisburse = async (loanId: string) => {
    if (!loanId) return;

    setActionLoading(loanId);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiFetch(`/dashboard/disbursement/${loanId}`, {
        method: 'PUT',
        body: {},
      });
      const data = await response.json();
      setSuccess(`Funds successfully released for Loan ID: ${loanId}! Transaction is finalized.`);
      // Update local state
      setLoans((prev) => prev.filter((l) => l._id !== loanId));
      if (manualLoanId === loanId) setManualLoanId('');
    } catch (err: any) {
      setError(err.message || 'Disbursement transaction failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setSuccess(`Loan ID copied to clipboard: ${id}`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center space-x-2">
            <Coins className="h-7 w-7 text-blue-600 animate-pulse" />
            <span>Fund Disbursement & Treasury Desk</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Authorize and disburse capital to approved borrowers, and manage transaction logs.
          </p>
        </div>
        <button
          onClick={fetchSanctionedLoans}
          className="mt-3 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all duration-150 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Action Panel / Manual Console */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium">
            <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2.5 border-b border-slate-100">
              Disbursement Terminal
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="manualId" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Enter Loan ID manually
                </label>
                <input
                  type="text"
                  id="manualId"
                  placeholder="65cf..."
                  value={manualLoanId}
                  onChange={(e) => setManualLoanId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                disabled={!manualLoanId || !!actionLoading}
                onClick={() => handleDisburse(manualLoanId)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all duration-150 disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Disburse Funds</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Disbursement Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Sanctioned:</span>
                <span className="font-bold text-blue-400">{loans.length} loans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Volume:</span>
                <span className="font-bold text-emerald-400">
                  ₹{loans.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Table List */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-premium overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Loans Awaiting Fund Release</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              {loans.length} Ready
            </span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3.5">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading sanctioned queue...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3.5 border border-slate-100">
                <Coins className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-700">All Funds Disbursed</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">There are no approved loan requests waiting for fund release at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Loan ID</th>
                    <th className="p-4">Borrower</th>
                    <th className="p-4">Principal Amount</th>
                    <th className="p-4">Total Repayment</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {loans.map((loan) => {
                    const borrower = (loan.borrowerId && typeof loan.borrowerId === 'object') 
                      ? (loan.borrowerId as PopulatedBorrower)
                      : { fullName: 'Unknown applicant', email: 'N/A' };

                    return (
                      <tr key={loan._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        {/* Copy ID */}
                        <td className="p-4 font-mono text-[10px] whitespace-nowrap">
                          <button
                            onClick={() => handleCopyId(loan._id)}
                            className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer text-slate-700 transition-colors duration-100"
                            title="Copy Loan ID"
                          >
                            <Clipboard className="h-3 w-3 text-slate-400" />
                            <span>{loan._id.slice(-6)}...</span>
                          </button>
                        </td>

                        {/* Borrower Details */}
                        <td className="p-4">
                          <span className="block font-bold text-slate-800">{borrower.fullName}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{borrower.email}</span>
                        </td>

                        {/* Principal Loan info */}
                        <td className="p-4">
                          <span className="block font-black text-slate-800">₹{loan.amount.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{loan.tenure} Days @ 12% SI</span>
                        </td>

                        {/* Total Repayment Cost */}
                        <td className="p-4">
                          <span className="block font-black text-blue-600">₹{loan.totalRepayment.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Includes ₹{(loan.totalRepayment - loan.amount).toLocaleString('en-IN')} interest</span>
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDisburse(loan._id)}
                            disabled={!!actionLoading}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded-lg font-bold disabled:opacity-40 transition-all duration-150 cursor-pointer"
                            title="Release Funds"
                          >
                            {actionLoading === loan._id ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-1.5 border-blue-600 border-t-transparent"></div>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>Release</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
