import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/errorMessage';

/**
 * Shown after sign-up — tells the user to check their inbox.
 * Also lets them resend the verification email.
 */
export function VerifyEmailPage() {
  const { user, resendVerification } = useAuth();
  const navigate = useNavigate();
  const email = user?.email ?? '';

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    if (!email) { navigate('/signup', { replace: true }); return; }
    setStatus('sending');
    const error = await resendVerification(email);
    if (error) {
      setStatus('error');
      setMessage(getErrorMessage(error));
    } else {
      setStatus('sent');
      setMessage('Verification email sent! Check your inbox (and spam folder).');
    }
  };

  return (
    <AuthLayout>
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <svg className="h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-bold">Check your email</h2>
      <p className="mt-2 text-slate-500">
        We sent a verification link to{' '}
        <span className="font-semibold text-slate-700">{email || 'your email address'}</span>.
        <br />Click the link to activate your Chefin account.
      </p>

      {/* Status feedback */}
      {status === 'sent' && (
        <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}
      {status === 'error' && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {message}
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          onClick={handleResend}
          disabled={status === 'sending' || status === 'sent'}
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Email sent ✓' : 'Resend verification email'}
        </button>

        <Link
          to="/signin"
          className="block w-full rounded-xl border border-slate-200 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Sign In
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Didn&apos;t get the email? Check your spam folder or try a different email address.
      </p>
    </AuthLayout>
  );
}
