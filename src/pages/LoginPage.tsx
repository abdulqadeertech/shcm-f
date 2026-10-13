import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { BrandLogo } from '../components/common/BrandLogo';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success } = useToast();

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mode: 'login' | 'signup'
  const initialMode =
    searchParams.get('mode') === 'signup' || window.location.pathname.includes('/signup')
      ? 'signup'
      : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & error state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google modal state for passwordless sign-in
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [savedGoogleEmail, setSavedGoogleEmail] = useState<string | null>(() => {
    return localStorage.getItem('novahcm_last_google_email');
  });

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && googleModalOpen) {
        setGoogleModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [googleModalOpen]);

  // 1. Handle Login Form Submit (Email & Password only)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await login(cleanEmail, password);
      success('Logged in successfully.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Sign Up Form Submit (Full Name, Email & Password only)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Full name is required.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: cleanName,
        email: cleanEmail,
        password,
      });
      success('Account created successfully.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Option 3: Continue with Google (Passwordless)
  const handleGoogleClick = () => {
    setError(null);
    // If the user already typed an email into the email field, use it directly
    if (email.trim() && email.includes('@')) {
      executeGoogleLogin(email.trim(), fullName.trim() || undefined);
      return;
    }
    // If they already have a remembered Google account on this device, log in directly
    if (savedGoogleEmail) {
      executeGoogleLogin(savedGoogleEmail, fullName.trim() || undefined);
      return;
    }
    // Otherwise open the Google email prompt
    setGoogleEmailInput('');
    setGoogleModalOpen(true);
  };

  const executeGoogleLogin = async (targetEmail: string, targetName?: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Google account email.');
      return;
    }

    setIsLoading(true);
    setGoogleModalOpen(false);
    setError(null);

    try {
      await loginWithGoogle(cleanEmail, targetName);
      localStorage.setItem('novahcm_last_google_email', cleanEmail);
      setSavedGoogleEmail(cleanEmail);
      success('Signed in with Google.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#051720] flex flex-col justify-center items-center px-4 py-8 sm:py-12 transition-colors antialiased select-none-text">
      {/* Top Controls: Subtle Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/portal" className="inline-flex justify-center mb-2">
            <BrandLogo size="lg" />
          </Link>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Sign in to access your workspace'
              : 'Create your account to get started'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#08222f] border border-slate-200 dark:border-[#14425b] rounded-2xl shadow-sm sm:shadow-md p-6 sm:p-8 transition-colors">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Mode Switcher: 1. Login | 2. Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#051822] rounded-xl border border-slate-200/80 dark:border-[#14425b] mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#ff6f32] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#ff6f32] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Option 3: Continue with Google */}
          <div>
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full h-11 flex items-center justify-center px-4 rounded-xl border border-slate-200 dark:border-[#14425b] bg-white dark:bg-[#051822] hover:bg-slate-50 dark:hover:bg-[#0c2f42] active:scale-[0.99] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {savedGoogleEmail && !email && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span className="truncate">
                  Saved: <strong className="text-slate-700 dark:text-slate-300 font-medium">{savedGoogleEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    localStorage.removeItem('novahcm_last_google_email');
                    setSavedGoogleEmail(null);
                    setGoogleEmailInput('');
                    setGoogleModalOpen(true);
                  }}
                  className="ml-2 text-[#ff6f32] hover:underline shrink-0 font-medium cursor-pointer"
                >
                  Use another
                </button>
              </div>
            )}
          </div>

          {/* Clean "or" divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-[#14425b]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2.5 bg-white dark:bg-[#08222f] text-slate-400">or</span>
            </div>
          </div>

          {mode === 'login' ? (
            /* Option 1: Login Form (Email & Password only) */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-11 px-3.5 pr-11 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex justify-center items-center px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#ff6f32] hover:bg-[#ea580c] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer shadow-xs mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
          ) : (
            /* Option 2: Sign Up Form (Full Name, Email & Password only) */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  autoComplete="name"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full h-11 px-3.5 pr-11 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex justify-center items-center px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#ff6f32] hover:bg-[#ea580c] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer shadow-xs mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </form>
          )}

          {/* Minimal Mode Toggle Link */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-[#ff6f32] hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-[#ff6f32] hover:underline font-semibold cursor-pointer"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Google Sign-in Account Chooser Modal (Passwordless) */}
      {googleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setGoogleModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#08222f] border border-slate-200 dark:border-[#14425b] rounded-2xl shadow-xl w-full max-w-sm p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Continue with Google
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your Google account email to sign in directly without a password.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (googleEmailInput.trim()) {
                  executeGoogleLogin(googleEmailInput.trim(), fullName.trim() || undefined);
                }
              }}
              className="space-y-3"
            >
              <div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-[#051822] border border-slate-200 dark:border-[#14425b] rounded-xl text-slate-900 dark:text-white text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6f32]/25 focus:border-[#ff6f32]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(false)}
                  className="h-10 px-3.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0c2f42] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !googleEmailInput.trim()}
                  className="h-10 px-4 rounded-xl text-xs font-semibold text-white bg-[#ff6f32] hover:bg-[#ea580c] active:scale-[0.99] disabled:opacity-50 transition cursor-pointer shadow-xs"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
