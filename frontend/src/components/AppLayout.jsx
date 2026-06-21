import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Kanban, LogOut, Menu, X, Plus } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', icon: Kanban },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-ink flex items-center justify-between px-4 py-3">
        <Logo className="[&_span]:text-paper" />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-paper p-1.5"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink flex-shrink-0 flex flex-col z-20 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-6 py-6 hidden lg:block">
          <Logo className="[&_span]:text-paper" />
        </div>

        <nav className="flex-1 px-3 mt-2 lg:mt-0 space-y-1 pt-16 lg:pt-0">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber text-ink'
                    : 'text-slate-light hover:bg-ink-light hover:text-paper'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-3">
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/pipeline?new=1');
            }}
            className="w-full flex items-center justify-center gap-2 bg-teal text-ink font-medium text-sm py-2.5 rounded-lg hover:bg-teal-dark hover:text-paper transition-colors mb-3"
          >
            <Plus size={16} />
            New application
          </button>
        </div>

        <div className="px-3 pb-5 border-t border-ink-light pt-4 mx-3">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-amber text-ink font-mono-tracker text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-paper font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-light truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-light hover:text-coral p-1.5 flex-shrink-0"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/50 z-10 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
