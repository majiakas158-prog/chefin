import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { FormField, inputClass } from '../components/auth/FormField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { RolePicker } from '../components/auth/RolePicker';
import { authClient } from '../lib/authClient';
import { useAuth } from '../contexts/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [role, setRole] = useState('chef');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    });

    if (authError) {
      setError(authError.message || 'Sign up failed. Please try again.');
      setLoading(false);
      return;
    }

    setUser(data.user);
    localStorage.setItem('selectedRole', role);
    navigate('/verify-email', { replace: true });
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold">Create Account</h2>
      <p className="mt-2 text-slate-500">Join CheafIn and start your journey today.</p>

      <h4 className="mt-7 font-semibold">Select Your Role</h4>
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
          className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-500 hover:underline" to="/signin">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}

