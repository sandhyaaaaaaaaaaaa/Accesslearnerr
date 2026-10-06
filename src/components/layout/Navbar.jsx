import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import {
  Type, Contrast, Menu, X, LogOut,
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import Button from '../ui/Button';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-ink/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-ink/5"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to={user ? `/${user.role}/dashboard` : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
                <span className="text-teal font-display font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-display font-semibold text-lg text-ink group-hover:text-teal transition-colors">
                  AccessLearner
                </span>
                {user && (
                  <span className="hidden sm:block text-xs text-muted capitalize">{user.role} portal</span>
                )}
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!user && !isLanding && (
              <>
                <Link to="/login" className="text-sm font-medium text-muted hover:text-ink transition-colors">Sign In</Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-ink">{user.name}</p>
                  <p className="text-xs text-muted capitalize">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-semibold text-sm">
                  {user.name.charAt(0)}
                </div>
                <Button variant="ghost" size="sm" onClick={logout} aria-label="Sign out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-ink/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-ink/5 animate-fade-in">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">{user.name}</p>
                <Button variant="ghost" onClick={() => { logout(); setMobileOpen(false); }}>Sign Out</Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export function AccessibilityToolbar({ settings, onUpdate }) {
  const fontSizes = ['small', 'medium', 'large', 'xlarge'];
  const currentIdx = fontSizes.indexOf(settings.fontSize);

  return (
    <div
      className="flex items-center gap-1 p-1 bg-cream-dark rounded-xl"
      role="toolbar"
      aria-label="Accessibility settings"
    >
      <button
        onClick={() => onUpdate({ fontSize: fontSizes[Math.max(0, currentIdx - 1)] })}
        className="p-2 rounded-lg hover:bg-surface text-muted hover:text-ink transition-colors"
        aria-label="Decrease font size"
        disabled={currentIdx <= 0}
      >
        <Type className="w-4 h-4" />
        <span className="sr-only">A-</span>
      </button>
      <button
        onClick={() => onUpdate({ fontSize: fontSizes[Math.min(fontSizes.length - 1, currentIdx + 1)] })}
        className="p-2 rounded-lg hover:bg-surface text-muted hover:text-ink transition-colors"
        aria-label="Increase font size"
        disabled={currentIdx >= fontSizes.length - 1}
      >
        <Type className="w-5 h-5" />
        <span className="sr-only">A+</span>
      </button>
      <div className="w-px h-6 bg-ink/10" aria-hidden="true" />
      <button
        onClick={() => onUpdate({ highContrast: !settings.highContrast })}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          settings.highContrast ? 'bg-ink text-white' : 'hover:bg-surface text-muted hover:text-ink'
        )}
        aria-label="Toggle high contrast"
        aria-pressed={settings.highContrast}
      >
        <Contrast className="w-4 h-4" />
      </button>
    </div>
  );
}
