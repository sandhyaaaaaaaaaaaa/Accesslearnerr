import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import {
  LayoutDashboard, Upload, Camera, FileText, MessageCircle,
  HelpCircle, Settings, Users, BarChart3, X,
} from 'lucide-react';
import clsx from 'clsx';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/upload', label: 'Upload', icon: Upload },
  { to: '/student/webcam', label: 'Webcam Scan', icon: Camera },
  { to: '/student/output', label: 'My Content', icon: FileText },
  { to: '/student/chat', label: 'AI Mentor', icon: MessageCircle },
  { to: '/student/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/students', label: 'Students', icon: Users },
  { to: '/teacher/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/teacher/upload', label: 'Upload', icon: Upload },
  { to: '/teacher/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-ink/30 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={clsx(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-ink/5',
          'transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-display font-semibold">Menu</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal/10 text-teal'
                    : 'text-muted hover:bg-ink/5 hover:text-ink'
                )
              }
            >
              <link.icon className="w-5 h-5" aria-hidden="true" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 bg-cream rounded-xl border border-ink/5">
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold text-ink">WCAG 2.1 AA</span> compliant interface with EPUB Accessibility 1.1 support.
          </p>
        </div>
      </aside>
    </>
  );
}
