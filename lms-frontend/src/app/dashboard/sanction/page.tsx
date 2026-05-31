'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  ShieldCheck, FileText, Check, X, AlertCircle, 
  CheckCircle2, RefreshCw, Clipboard, ExternalLink 
} from 'lucide-react';

interface PopulatedBorrower {
  _id: string;
  email: string;
  fullName: string;
  pan?: string;
  monthlySalary?: number;
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

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Custom manual input box states
  const [manualLoanId, setManualLoanId] = useState('');
  
  // Rejection modal/in-line states
  const [rejectionLoanId, setRejectionLoanId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPendingLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/dashboard/sanction/pending');
      const data = await response.json();
      setLoans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleApprove = async (loanId: string) => {
    setActionLoading(loanId);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiFetch(`/dashboard/sanction/${loanId}`, {
        method: 'PUT',
        body: { status: 'SANCTIONED' },
      });
      const data = await response.json();
      setSuccess(`Loan ${loanId} successfully approved and moved to Disbursement queue!`);
      // Update local state
      setLoans((prev) => prev.filter((l) => l._id !== loanId));
      if (manualLoanId === loanId) setManualLoanId('');
    } catch (err: any) {
      setError(err.message || 'Approval action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionLoanId) return;

    setActionLoading(rejectionLoanId);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiFetch(`/dashboard/sanction/${rejectionLoanId}`, {
        method: 'PUT',
        body: { status: 'REJECTED', rejectionReason },
      });
      setSuccess(`Loan ${rejectionLoanId} successfully rejected.`);
      setLoans((prev) => prev.filter((l) => l._id !== rejectionLoanId));
      setRejectionLoanId(null);
      setRejectionReason('');
      if (manualLoanId === rejectionLoanId) setManualLoanId('');
    } catch (err: any) {
      setError(err.message || 'Rejection action failed.');
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
            <ShieldCheck className="h-7 w-7 text-purple-600" />
            <span>Underwriting & Sanction Desk</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Evaluate credit applications, audit borrower salary slips, and sanction requests.
          </p>
        </div>
        <button
          onClick={fetchPendingLoans}
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
              Manual Action Console
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
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!manualLoanId || !!actionLoading}
                  onClick={() => handleApprove(manualLoanId)}
                  className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all duration-150 disabled:opacity-40 cursor-pointer flex items-center justify-center"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={!manualLoanId || !!actionLoading}
                  onClick={() => {
                    setRejectionLoanId(manualLoanId);
                    setRejectionReason('');
                  }}
                  className="py-2 px-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all duration-150 disabled:opacity-40 cursor-pointer flex items-center justify-center"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Console Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Pending:</span>
                <span className="font-bold text-purple-400">{loans.length} requests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Review SLA:</span>
                <span className="font-bold text-emerald-400">Under 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Table List */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-premium overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Pending Credit Applications</h2>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
              {loans.length} Pending
            </span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3.5">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-purple-600 border-t-transparent"></div>
              <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading loan applications...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3.5 border border-slate-100">
                <ShieldCheck className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-700">Clear Desk</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">There are no pending loan applications awaiting underwriting reviews at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Loan ID</th>
                    <th className="p-4">Borrower details</th>
                    <th className="p-4">Requested Loan</th>
                    <th className="p-4">Salary Audit</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {loans.map((loan) => {
                    const borrower = (loan.borrowerId && typeof loan.borrowerId === 'object') 
                      ? (loan.borrowerId as PopulatedBorrower)
                      : { fullName: 'Unknown applicant', email: 'N/A' };
                    
                    const slipLink = loan.salarySlipUrl
                      ? `http://localhost:5000/${loan.salarySlipUrl.replace(/\\/g, '/')}`
                      : null;

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

                        {/* Requested Loan info */}
                        <td className="p-4">
                          <span className="block font-black text-slate-800">₹{loan.amount.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{loan.tenure} Days @ 12% SI</span>
                        </td>

                        {/* Salary Slip statically served link */}
                        <td className="p-4">
                          {slipLink ? (
                            <a
                              href={slipLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 font-bold border-b border-transparent hover:border-blue-800"
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <span>View Slip</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No File</span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(loan._id)}
                              disabled={!!actionLoading}
                              className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-40 transition-colors duration-150 cursor-pointer"
                              title="Approve / Sanction"
                            >
                              {actionLoading === loan._id ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-1.5 border-emerald-600 border-t-transparent"></div>
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setRejectionLoanId(loan._id);
                                setRejectionReason('');
                              }}
                              disabled={!!actionLoading}
                              className="h-7 w-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-100 hover:text-rose-700 disabled:opacity-40 transition-colors duration-150 cursor-pointer"
                              title="Reject Application"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
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

      {/* Rejection Reasons Overlay / Popup Modal */}
      {rejectionLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-100 text-rose-600">
              <X className="h-6 w-6 rounded-full bg-rose-50 border border-rose-200 p-0.5 shrink-0" />
              <h3 className="text-base font-bold text-slate-800">Reject Application</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-medium">
              You are about to reject Loan Request <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">{rejectionLoanId.slice(-8)}</span>. Please supply a concrete underwriting rejection reason.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label htmlFor="reason" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Rejection Reason
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  required
                  placeholder="Salary validation checks failed or invalid documentation provided."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setRejectionLoanId(null)}
                  className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
