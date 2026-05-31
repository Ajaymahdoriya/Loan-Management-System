'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, Landmark } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const displayName = user.fullName || user.email.split('@')[0] || 'User';

  const roleStyles: Record<string, string> = {
    Admin: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10',
    Sales: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
    Sanction: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10',
    Disbursement: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10',
    Collection: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10',
    Borrower: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-600/10',
  };

  const badgeClass = roleStyles[user.role] || 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/10';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md shadow-premium">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">SafeFund</span>
              <span className="text-xs block text-slate-500 font-medium -mt-1">Loan Management System</span>
            </div>
          </div>

          {/* Profile & Controls */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 border-r border-slate-200 pr-6">
              <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <div className="text-right">
                <span className="block text-sm font-semibold text-slate-800 capitalize leading-none mb-1">
                  {displayName}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
