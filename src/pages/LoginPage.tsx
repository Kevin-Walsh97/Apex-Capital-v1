import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay to simulate network request
    await new Promise((r) => setTimeout(r, 300));

    const user = login(email, password);
    setIsLoading(false);

    if (!user) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // Navigate based on role
    if (user.role === 'Advisor') {
      navigate('/advisor');
    } else if (user.role === 'GP') {
      navigate('/gp');
    } else {
      navigate('/lp');
    }
  };

  const fillCredentials = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-700 rounded-xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Apex Capital Solutions</h1>
          <p className="text-sm text-gray-500 mt-1">AI-Powered Data Room for Private Markets</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy-700 hover:bg-navy-800 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Demo Credentials (click to fill)
          </p>
          <div className="space-y-2 text-sm">
            {/* Advisor */}
            <button
              type="button"
              onClick={() => fillCredentials('advisor@demo.com')}
              className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 rounded-lg px-3 py-2 transition text-left"
            >
              <div>
                <span className="font-medium text-purple-700">Advisor:</span>{' '}
                <span className="text-purple-600">advisor@demo.com</span>
              </div>
              <span className="text-purple-400 text-xs">All funds</span>
            </button>

            {/* GP accounts */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">GP Accounts (firm-specific access)</p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => fillCredentials('gp@sequoia.com')}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition text-left"
                >
                  <div>
                    <span className="font-medium text-gray-700">Sequoia GP:</span>{' '}
                    <span className="text-gray-500">gp@sequoia.com</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('gp@apollo.com')}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition text-left"
                >
                  <div>
                    <span className="font-medium text-gray-700">Apollo GP:</span>{' '}
                    <span className="text-gray-500">gp@apollo.com</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('gp@blackstone.com')}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition text-left"
                >
                  <div>
                    <span className="font-medium text-gray-700">Blackstone GP:</span>{' '}
                    <span className="text-gray-500">gp@blackstone.com</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('gp@firstmark.com')}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition text-left"
                >
                  <div>
                    <span className="font-medium text-gray-700">FirstMark GP:</span>{' '}
                    <span className="text-gray-500">gp@firstmark.com</span>
                  </div>
                </button>
              </div>
            </div>

            {/* LP account */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => fillCredentials('lp@demo.com')}
                className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 rounded-lg px-3 py-2 transition text-left"
              >
                <div>
                  <span className="font-medium text-green-700">LP User:</span>{' '}
                  <span className="text-green-600">lp@demo.com</span>
                </div>
                <span className="text-green-400 text-xs">Investor view</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Password for all: password123</p>
        </div>
      </div>
    </div>
  );
}
