import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Kanban, Mail,
  LogOut, Code2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../ui/BrandLogo';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/emails', icon: Mail, label: 'Email Sequences' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <BrandLogo size="md" />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              fontSize: 14, fontWeight: isActive ? 600 : 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              color: isActive ? '#2563eb' : '#475569',
              background: isActive ? '#eff6ff' : 'transparent',
              border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Creator & Developer Section */}
      <div style={{
        margin: '0 12px 10px',
        padding: '10px 12px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Code2 size={12} color="#4f46e5" /> Creator & Developer
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
            color: '#fff',
            padding: '1px 6px',
            borderRadius: 10,
          }}>
            Lead
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: '#fff', fontSize: 12, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(79,70,229,0.3)',
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Armin</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Full-Stack Engineer</div>
          </div>
        </div>
      </div>

      {/* User + Logout */}
      <div style={{ padding: '12px 12px 14px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
        <div style={{
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: 8, padding: '8px 10px', marginBottom: 8,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 1 }}>
            {user?.fullName || 'User'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary w-full"
          style={{ justifyContent: 'center', fontSize: 12, padding: '6px 12px' }}
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
