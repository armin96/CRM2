import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Kanban, Mail,
  LogOut, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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
      width: '230px', flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
        }}>
          <Zap size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', color: '#0f172a' }}>MiniCRM</div>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>SALES PIPELINE</div>
        </div>
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

      {/* User + Logout */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
        <div style={{
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: 8, padding: '10px 12px', marginBottom: 8,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
            {user?.fullName || 'User'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary w-full"
          style={{ justifyContent: 'center', fontSize: 13 }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
