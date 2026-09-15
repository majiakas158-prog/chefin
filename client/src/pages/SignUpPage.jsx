import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { getErrorMessage } from '../lib/errorMessage';
import { FormField, inputClass } from '../components/auth/FormField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { RolePicker } from '../components/auth/RolePicker';
import { authClient } from '../lib/authClient';
import { useAuth } from '../contexts/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [role, setRole] = useState(() => localStorage.getItem('selectedRole') || 'chef');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Chef-specific fields
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');

  // Restaurant-specific fields
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [city, setCity] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const fd = new FormData(event.currentTarget);
    const fullName = fd.get('name');
    const email = fd.get('email');

    // Encode role + profile data into the name field as JSON.
    // The server databaseHook parses this to create the Profile row.
    const profilePayload =
      role === 'chef'
        ? {
            name: fullName,
            role,
            ...(experience && { experience: Number(experience) }),
            ...(specialization && { specialization }),
            ...(preferredLocation && { preferredLocation }),
          }
        : {
            name: fullName,
            role,
            ...(restaurantName && { restaurantName }),
            ...(restaurantAddress && { restaurantAddress }),
            ...(city && { city }),
          };

    const { data, error: authError } = await authClient.signUp.email({
      email,
      password,
      name: JSON.stringify(profilePayload),
      // Better Auth uses this after the recipient clicks the verification link.
      callbackURL: '/session-redirect',
    });

    if (authError) {
      setError(getErrorMessage(authError, 'Sign up failed. Please try again.'));
      setLoading(false);
      return;
    }

    setUser(data.user);
    localStorage.setItem('selectedRole', role);
    navigate('/verify-email', { replace: true });
  };

  return (
    <AuthLayout>
      <p className="text-sm font-semibold text-brand-600">JOIN CHEFIN</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
      <p className="mt-2 text-slate-500">Set up your profile and start making the right connections.</p>

      <h4 className="mt-7 text-sm font-semibold text-slate-700">First, tell us who you are</h4>
      <RolePicker role={role} setRole={setRole} />

      <form onSubmit={submit}>
        <FormField label="Full Name">
          <input
            className={inputClass}
            name="name"
            placeholder="Enter your full name"
            required
          />
        </FormField>

        <FormField label="Email Address">
          <input
            className={inputClass}
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput value={password} setValue={setPassword} placeholder="Create password" />
        </FormField>

        <FormField label="Confirm Password">
          <PasswordInput value={confirm} setValue={setConfirm} placeholder="Confirm password" />
        </FormField>

        {/* Role-specific fields */}
        {role === 'chef' ? (
          <>
            <FormField label="Years of Experience">
              <input
                className={inputClass}
                type="number"
                min="0"
                max="70"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5"
              />
            </FormField>
            <FormField label="Specialization">
              <input
                className={inputClass}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Indian, Chinese, Italian…"
              />
            </FormField>
            <FormField label="Preferred Job Location">
              <input
                className={inputClass}
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="City"
              />
            </FormField>
          </>
        ) : (
          <>
            <FormField label="Restaurant Name">
              <input
                className={inputClass}
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Restaurant name"
              />
            </FormField>
            <FormField label="Restaurant Address">
              <textarea
                className={inputClass}
                rows="3"
                value={restaurantAddress}
                onChange={(e) => setRestaurantAddress(e.target.value)}
                placeholder="Restaurant address"
              />
            </FormField>
            <FormField label="City">
              <input
                className={inputClass}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </FormField>
          </>
        )}

        <label className="mb-5 block text-sm text-slate-600">
          <input className="mr-2 accent-brand-500" type="checkbox" required />
          I agree to the Terms &amp; Conditions
        </label>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-brand-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={async () => {
          setGoogleLoading(true);
          await authClient.signIn.social({ provider: 'google', callbackURL: '/complete-profile' });
        }}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-500 hover:underline" to="/signin">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
