import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RolePicker } from '../components/auth/RolePicker';
import { FormField, inputClass } from '../components/auth/FormField';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/errorMessage';
import { userApi } from '../lib/api';

/**
 * Shown after Google OAuth sign-in to let the user pick their role
 * (chef or restaurant) and fill in any missing profile details.
 *
 * If the user already has a fully-set profile (e.g. returning Google user),
 * they are immediately bounced to the right dashboard.
 */
export function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [role, setRole] = useState('chef');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Chef fields
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');

  // Restaurant fields
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [city, setCity] = useState('');

  // Fetch existing profile — bounce returning users straight to their dashboard
  useEffect(() => {
    if (!user) { navigate('/signin', { replace: true }); return; }

    userApi.getMe().then(({ data }) => {
      const profile = data?.data;
      if (profile?.role) {
        setRole(profile.role);
        // Pre-fill existing values
        setExperience(profile.experience ?? '');
        setSpecialization(profile.specialization ?? '');
        setPreferredLocation(profile.preferredLocation ?? '');
        setRestaurantName(profile.restaurantName ?? '');
        setRestaurantAddress(profile.restaurantAddress ?? '');
        setCity(profile.city ?? '');
      }
      setLoading(false);
    }).catch((err) => {
      setError(getErrorMessage(err, 'We could not load your profile. You can still complete it below.'));
      setLoading(false);
    });
  }, [user, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const profilePayload =
      role === 'chef'
        ? {
            role,
            ...(experience && { experience: Number(experience) }),
            ...(specialization && { specialization }),
            ...(preferredLocation && { preferredLocation }),
          }
        : {
            role,
            ...(restaurantName && { restaurantName }),
            ...(restaurantAddress && { restaurantAddress }),
            ...(city && { city }),
          };

    try {
      await userApi.updateMe(profilePayload);
      localStorage.setItem('selectedRole', role);
      navigate(
        role === 'restaurant' ? '/restaurant-dashboard' : '/chef-dashboard',
        { replace: true },
      );
    } catch (err) {
      setError(getErrorMessage(err, 'We could not save your profile. Please try again.'));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold">One more step! 🎉</h2>
      <p className="mt-2 text-slate-500">
        Hi <strong>{user?.name}</strong>! Tell us a bit about yourself so we can
        personalise your Chefin experience.
      </p>

      <h4 className="mt-7 font-semibold">I am a…</h4>
      <RolePicker role={role} setRole={setRole} />

      <form onSubmit={submit} className="mt-2">
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

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <button
          className="mt-2 w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Continue to Dashboard →'}
        </button>
      </form>
    </AuthLayout>
  );
}
