import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="bg-white rounded-card shadow-card p-7 border border-slate-light/40">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">Start tracking</h1>
          <p className="text-sm text-slate-dark mb-6">Build your pipeline in under a minute.</p>

          {error && (
            <div className="flex items-start gap-2 bg-coral-light text-coral-dark text-sm rounded-lg p-3 mb-4">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono-tracker uppercase tracking-wide text-slate-dark mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-light bg-paper focus:bg-white focus:border-amber outline-none transition-colors text-sm"
                placeholder="Jordan Avery"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono-tracker uppercase tracking-wide text-slate-dark mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-light bg-paper focus:bg-white focus:border-amber outline-none transition-colors text-sm"
                placeholder="you@school.edu"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono-tracker uppercase tracking-wide text-slate-dark mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-light bg-paper focus:bg-white focus:border-amber outline-none transition-colors text-sm"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper font-medium py-2.5 rounded-lg hover:bg-ink-light transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-dark mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-medium underline underline-offset-2 hover:text-amber-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
