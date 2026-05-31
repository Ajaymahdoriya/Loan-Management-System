'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  Landmark, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, 
  User, Calendar, Briefcase, CreditCard 
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [pan, setPan] = useState('');
  const [employmentMode, setEmploymentMode] = useState('Salaried');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isSignup) {
      try {
        await apiFetch('/auth/register', {
          method: 'POST',
          body: { 
            email, 
            password, 
            fullName, 
            pan: pan.toUpperCase(), 
            dob, 
            monthlySalary: Number(monthlySalary), 
            employmentMode 
          },
        });
        
        setSuccess('Account created successfully! Switching to Login...');
        
        setTimeout(() => {
          setIsSignup(false);
          setPassword('');
          setLoading(false);
          setSuccess(null);
        }, 1200);
      } catch (err: any) {
        setError(err.message || 'Registration failed. Check your parameters.');
        setLoading(false);
      }
    } else {
      try {
        const response = await apiFetch('/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        const data = await response.json();
        
        setSuccess('Successfully authenticated! Redirecting...');
        
        setTimeout(() => {
          login(data.user, data.token);
        }, 800);
      } catch (err: any) {
        setError(err.message || 'Invalid credentials or connection error.');
        setLoading(false);
      }
    }
  };

  const handleQuickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    setError(null);
  };

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 dashboard-grid-pattern">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg text-white mb-3">
            <Landmark className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SafeFund</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">Enterprise RBAC Loan Management Node</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-premium p-8 relative overflow-hidden transition-all-300 hover:shadow-premium-hover">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {isSignup ? 'Create Borrower Account' : 'Account Authentication'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium animate-fade-in">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-xs">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium animate-fade-in">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span className="text-xs">{success}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@safefund.com"
                  suppressHydrationWarning
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Secure Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  suppressHydrationWarning
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-fade-in">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dob" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="monthlySalary" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Monthly Salary (INR)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      name="monthlySalary"
                      id="monthlySalary"
                      required
                      min="0"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(e.target.value)}
                      placeholder="50000"
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pan" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    PAN Number (10-Digit)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="pan"
                      id="pan"
                      required
                      maxLength={10}
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      placeholder="ABCDE1234F"
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="employmentMode" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Employment Mode
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <select
                      name="employmentMode"
                      id="employmentMode"
                      required
                      value={employmentMode}
                      onChange={(e) => setEmploymentMode(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                    >
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-150 cursor-pointer mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                isSignup ? 'Register Borrower Account' : 'Authenticate Credentials'
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleToggle}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer"
            >
              {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {!isSignup && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-premium">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5 text-center">
              QUICK-FILL ROLE CREDENTIALS
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Sanction Officer', email: 'sanction@test.com', color: 'hover:border-purple-400 hover:bg-purple-50/30' },
                { label: 'Disbursement', email: 'disbursement@test.com', color: 'hover:border-blue-400 hover:bg-blue-50/30' },
                { label: 'Collection Agent', email: 'collection@test.com', color: 'hover:border-amber-400 hover:bg-amber-50/30' },
                { label: 'Eligible Borrower', email: 'borrower@test.com', color: 'hover:border-teal-400 hover:bg-teal-50/30' },
              ].map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => handleQuickFill(shortcut.email)}
                  className={`p-2.5 border border-slate-200 rounded-xl text-left transition-all duration-150 text-xs ${shortcut.color} cursor-pointer group`}
                >
                  <span className="block font-bold text-slate-700 group-hover:text-blue-600">{shortcut.label}</span>
                  <span className="block text-slate-400 group-hover:text-slate-500 font-mono mt-0.5 truncate">{shortcut.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
