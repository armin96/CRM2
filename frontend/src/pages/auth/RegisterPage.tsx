import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, TrendingUp, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../../components/ui/BrandLogo';
import loginIllustration from '../../assets/login-illustration.jpg';

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
    <div className="auth-split-wrapper">
      {/* Left Column: Form */}
      <div className="auth-form-column">
        <div className="auth-form-box">
          <div style={{ textAlign: 'center', marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BrandLogo size="xl" />
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a', marginTop: 16 }}>Create account</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
              Start managing your high-converting pipeline
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

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
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

      {/* Right Column: 2D Minimalist Hero Showcase */}
      <div className="auth-hero-column">
        <div className="auth-hero-inner">
          <div className="auth-hero-badge">
            <TrendingUp size={14} />
            <span>High-Velocity Sales Pipeline</span>
          </div>

          <h2 className="auth-hero-title">
            Manage relationships. Close deals with confidence.
          </h2>

          <p className="auth-hero-desc">
            An intuitive, distraction-free workspace designed to track lead stages, conversion funnels, and customer touchpoints in real time.
          </p>

          <div className="auth-illustration-container">
            <img
              src={loginIllustration}
              alt="Nexora CRM 2D Sales Analytics Illustration"
              className="auth-illustration-img"
            />
          </div>

          <div className="auth-feature-pills">
            <div className="auth-feature-pill">
              <CheckCircle2 size={15} color="#2563eb" />
              <span>Interactive Kanban</span>
            </div>
            <div className="auth-feature-pill">
              <Zap size={15} color="#2563eb" />
              <span>Pipeline Funnels</span>
            </div>
            <div className="auth-feature-pill">
              <ShieldCheck size={15} color="#2563eb" />
              <span>Contact Intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
