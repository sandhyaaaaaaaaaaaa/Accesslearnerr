import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { apiPost } from '../utils/apiClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const user = await apiPost('/auth/login', { email, password, role });
      login(user);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 pattern-dots">
      <Card className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display mb-2">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to your AccessLearner account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
              placeholder="you@school.edu"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
              autoComplete="current-password"
              required
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">I am a</legend>
            <div className="flex gap-3">
              {['student', 'teacher'].map((r) => (
                <label
                  key={r}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-colors capitalize ${
                    role === r ? 'border-teal bg-teal/5 text-teal' : 'border-ink/10 hover:border-ink/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                    className="sr-only"
                  />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg">Sign In</Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal font-medium hover:underline">Register</Link>
        </p>

        <p className="text-center text-xs text-muted mt-4">
          Demo mode: enter any email/password to sign in.
        </p>
      </Card>
    </div>
  );
}
