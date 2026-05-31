'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  CreditCard, FileInput, CheckCircle2, AlertCircle, 
  HelpCircle, Receipt, ArrowRightLeft, ShieldAlert 
} from 'lucide-react';

export default function CollectionDashboard() {
  // Form states
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [utrNumber, setUtrNumber] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Repayment response status state
  const [updatedStatus, setUpdatedStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanId.trim()) {
      setError('A valid Loan ID is required.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }
    if (!utrNumber.trim()) {
      setError('A unique bank UTR number is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setUpdatedStatus(null);

    try {
      const response = await apiFetch('/dashboard/collection/payment', {
        method: 'POST',
        body: {
          loanId: loanId.trim(),
          amount: Number(amount),
          utrNumber: utrNumber.trim(),
        },
      });

      const data = await response.json();
      setSuccess(`Payment successfully recorded! UTR transaction logged in treasury ledger.`);
      setUpdatedStatus(data.status);
      
      // Clear form inputs
      setLoanId('');
      setAmount('');
      setUtrNumber('');
    } catch (err: any) {
      setError(err.message || 'Payment recording failed. Ensure the Loan ID is active and UTR is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="pb-5 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center space-x-2">
          <CreditCard className="h-7 w-7 text-amber-600" />
          <span>Repayment & Collections Desk</span>
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Log bank wire transfers, match UTR references, and update loan statuses to closed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-premium p-6 md:p-8">
          <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-slate-100">
            <FileInput className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-800">Record a Repayment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start space-x-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium animate-fade-in">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Transaction Blocked:</span>
                  <p className="text-xs text-rose-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Repayment Recorded</span>
                  <p className="text-xs text-emerald-600 mt-1">{success}</p>
                  {updatedStatus && (
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">New Loan Status:</span>
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                        updatedStatus === 'CLOSED' 
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 ring-blue-600/20 border border-blue-200'
                      }`}>
                        {updatedStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loan ID Input */}
            <div>
              <label htmlFor="loanId" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Loan Identifier (ID)
              </label>
              <input
                type="text"
                id="loanId"
                required
                placeholder="65cf1a2b3c4d..."
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Payment Amount */}
              <div>
                <label htmlFor="amount" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Amount Paid (INR)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm">
                    ₹
                  </div>
                  <input
                    type="number"
                    id="amount"
                    required
                    min="1"
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-8 pr-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* UTR Number */}
              <div>
                <label htmlFor="utr" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Bank UTR / Transaction Reference
                </label>
                <input
                  type="text"
                  id="utr"
                  required
                  placeholder="UTR123456789"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Receipt className="h-4.5 w-4.5" />
                  <span>Log Wire Receipt</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Operational Guidelines */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-premium p-6 overflow-hidden relative">
            <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2.5 border-b border-slate-100 flex items-center space-x-1.5">
              <ArrowRightLeft className="h-4 w-4 text-amber-500" />
              <span>UTR Reference Compliance</span>
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              A Unique Transaction Reference (UTR) is a 22 or 16-character string issued by Indian commercial banks for wire transfers (NEFT, RTGS, IMPS).
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2 font-mono">
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px]">Validation Rule:</span>
                <span>Each UTR must be completely unique to prevent duplicate credit fraud.</span>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="block font-bold text-slate-400 uppercase text-[9px]">Status Updates:</span>
                <span>If total amount logged equals or exceeds the total repayment target, status auto-flips to <span className="font-bold text-emerald-600">CLOSED</span>.</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span>Operational Tips</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></div>
                <span>Double-check numbers to ensure the borrower is not credited for less than their actual payment.</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></div>
                <span>Only <span className="font-semibold text-white">DISBURSED</span> loans are eligible to accept payments. Pending or rejected applications will throw error.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
