import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../../components/ui/BrandLogo';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('demo@minicrm.io');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      login(data.token, { id: data.userId, email: data.email, fullName: data.fullName });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BrandLogo size="xl" />
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a', marginTop: 16 }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Sign in to access your sales workspace
          </p>
        </div>

        <div className="card" style={{ padding: '28px 24px' }}>
          {/* Demo hint */}
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13,
            color: '#1e40af',
          }}>
            🚀 <strong style={{ color: '#1e3a8a' }}>Demo pre-filled</strong> — just click Sign in!
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="search-input">
                <Mail size={15} className="icon" />
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2,
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <div style={{ color: '#dc2626', fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>

        {/* Creator Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span>Developed with precision by</span>
          <span style={{
            fontWeight: 700,
            color: '#475569',
            background: '#e2e8f0',
            padding: '2px 8px',
            borderRadius: 12,
          }}>
            Armin
          </span>
        </div>
      </div>
    </div>
  );
}
