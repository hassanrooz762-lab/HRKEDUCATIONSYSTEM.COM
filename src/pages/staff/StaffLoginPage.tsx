import React, { useState } from 'react';
import { Crest } from '../../components/Crest';
import { StaffUser } from '../../types';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface StaffLoginPageProps {
  onLoginSuccess: (user: StaffUser, token: string) => void;
  onBackToPublic: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onLoginSuccess,
  onBackToPublic,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const codeToVerify = accessCode.trim();
    if (!codeToVerify) {
      setError('Please enter the security access passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToVerify, username: 'admin' }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Authentication rejected. Please verify your passcode.');
      } else {
        // Save token in localStorage for client auth header fallback
        if (json.token) {
          localStorage.setItem('hrk_staff_token', json.token);
        }
        onLoginSuccess(json.user, json.token);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to contact authentication server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-red-950 to-stone-950 text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Crest & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Crest size="lg" variant="dark" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-900/60 border border-yellow-500/40 text-yellow-300 text-xs font-bold uppercase tracking-wider shadow">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-brand">
            Staff Portal Access
          </h1>
          <p className="text-red-200 text-xs sm:text-sm">
            Enter designated administrative access code to open student records, examination marks, and fee controls.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-stone-900/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-red-700/80 p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                Administrative Passcode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-400">
                  <KeyRound className="w-5 h-5 text-yellow-400" />
                </div>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-red-900/80 bg-stone-950/80 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-base font-mono tracking-widest text-white outline-none transition placeholder:text-stone-600"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950 border border-red-700 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-red-300 block">Access Denied:</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 disabled:bg-stone-700 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-500"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-yellow-300" />
                  <span>Verify & Unlock Portal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Public Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToPublic}
            className="text-xs font-semibold text-stone-400 hover:text-yellow-300 transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>&larr; Return to Public School Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
