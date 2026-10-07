import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { apiPost } from '../utils/apiClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      let user;
      try {
        user = await apiPost('/auth/register', { name, email, password, role });
      } catch (apiErr) {
        console.warn('Backend API unreachable, registering user in demo mode:', apiErr);
        user = { id: 'user-' + Date.now(), name, email, role };
      }
      register(user);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 pattern-dots">
      <Card className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display mb-2">Create your account</h1>
          <p className="text-muted text-sm">Start your inclusive learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-surface focus:border-teal focus:ring-1 focus:ring-teal"
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
              minLength={6}
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
                  <input type="radio" name="role" value={r} checked={role === r} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <Button type="submit" className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal font-medium hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  );
}
