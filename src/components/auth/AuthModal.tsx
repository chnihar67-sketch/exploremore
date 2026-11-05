import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, UserCheck, Briefcase, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchUserRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('tourist');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    if (isRegister) {
      if (!name) {
        setError('Please enter your full name');
        return;
      }
      register(name, email, role, phone);
      onClose();
    } else {
      login(email, role);
      onClose();
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    switchUserRole(demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf7f2] w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-[#1b4332]">Localora</span>
            <span className="text-xs text-stone-400">|</span>
            <span className="text-xs font-medium text-stone-600">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Quick Demo Login shortcuts for judges & evaluators */}
          <div className="mb-5 p-3.5 bg-[#eef5f0] border border-[#2d5a43]/20 rounded-xl">
            <div className="text-[11px] font-semibold text-[#1b4332] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Instant Evaluator Logins</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('tourist')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-medium text-stone-800 transition-colors text-center"
              >
                Tourist
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('business_owner')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-medium text-[#2d5a43] font-semibold transition-colors text-center"
              >
                Host Owner
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-medium text-amber-900 transition-colors text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector during registration */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('tourist')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      role === 'tourist'
                        ? 'border-[#2d5a43] bg-white ring-2 ring-[#2d5a43]/20'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-[#2d5a43] mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Tourist</div>
                      <div className="text-[10px] text-stone-500">Explore &amp; book</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('business_owner')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      role === 'business_owner'
                        ? 'border-[#2d5a43] bg-white ring-2 ring-[#2d5a43]/20'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-[#2d5a43] mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Local Host</div>
                      <div className="text-[10px] text-stone-500">List stays &amp; tours</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Hegde"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30 focus:border-[#2d5a43]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30 focus:border-[#2d5a43]"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30 focus:border-[#2d5a43]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30 focus:border-[#2d5a43]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#2d5a43] hover:bg-[#1b4332] rounded-lg transition-colors shadow-sm mt-2"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-stone-600">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-[#2d5a43] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to Localora?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-[#2d5a43] font-semibold hover:underline"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
