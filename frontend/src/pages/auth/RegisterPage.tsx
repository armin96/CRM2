import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.register(form);
      login(data.token, { id: data.userId, email: data.email, fullName: data.fullName });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)', marginBottom: 14,
          }}>
            <Zap size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Create account</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            Start managing your sales pipeline
          </p>
        </div>

        <div className="card" style={{ padding: '28px 24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="search-input">
                <User size={15} className="icon" />
                <input className="form-input" style={{ paddingLeft: 36 }} type="text"
                  value={form.fullName} onChange={set('fullName')} placeholder="Alex Johnson" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="search-input">
                <Mail size={15} className="icon" />
                <input className="form-input" style={{ paddingLeft: 36 }} type="email"
                  value={form.email} onChange={set('email')} placeholder="you@company.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="search-input">
                <Lock size={15} className="icon" />
                <input className="form-input" style={{ paddingLeft: 36 }} type="password"
                  value={form.password} onChange={set('password')} placeholder="Min 6 characters"
                  minLength={6} required />
              </div>
            </div>

            {error && <div style={{ color: '#dc2626', fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" /> : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
