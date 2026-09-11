import { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { FormField,inputClass } from '../components/auth/FormField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { RolePicker } from '../components/auth/RolePicker';
import { Link, useNavigate } from 'react-router-dom';

export function SignInPage() {
  const navigate = useNavigate();
  const [role, setRoleState] = useState(() => localStorage.getItem('selectedRole') || 'chef');
  const [email, setEmail] = useState(() => localStorage.getItem('rememberEmail') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('rememberEmail')));
  const setRole = (value) => { setRoleState(value); localStorage.setItem('selectedRole', value); };
  const submit = (event) => { event.preventDefault(); remember ? localStorage.setItem('rememberEmail', email) : localStorage.removeItem('rememberEmail'); alert('Login Successful!'); navigate(role === 'chef' ? '/chef-dashboard' : '/restaurant-dashboard'); };
  return <AuthLayout><h2 className="text-3xl font-bold">Welcome Back 👋</h2><p className="mt-2 text-slate-500">Sign in to continue using CheafIn.</p><h4 className="mt-7 font-semibold">Select Your Role</h4><RolePicker role={role} setRole={setRole} /><form onSubmit={submit}><FormField label="Email Address"><input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required /></FormField><FormField label="Password"><PasswordInput value={password} setValue={setPassword} placeholder="Enter your password" /></FormField><div className="mb-6 flex justify-between text-sm"><label className="text-slate-600"><input className="mr-2 accent-brand-500" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember Me</label><Link className="text-brand-500 hover:underline" to="/signin">Forgot Password?</Link></div><button className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition hover:bg-brand-600">Sign In</button></form><div className="my-6 text-center text-sm text-slate-400">OR</div><button className="w-full rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 hover:bg-slate-50" type="button">G &nbsp; Continue with Google</button><p className="mt-6 text-center text-sm text-slate-500">Don't have an account? <Link className="font-semibold text-brand-500 hover:underline" to="/signup">Create Account</Link></p></AuthLayout>;
}
