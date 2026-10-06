import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar, { AccessibilityToolbar } from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

export default function Layout({ showSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { a11ySettings, updateA11y } = useApp();

  const fontSizeMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col',
        a11ySettings.highContrast && 'bg-white text-black [&_.glass-card]:bg-white [&_.glass-card]:border-black/20',
        fontSizeMap[a11ySettings.fontSize]
      )}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <div className="flex-1 flex flex-col min-w-0">
          {showSidebar && (
            <div className="flex justify-end px-6 py-2 border-b border-ink/5 bg-cream/50">
              <AccessibilityToolbar settings={a11ySettings} onUpdate={updateA11y} />
            </div>
          )}
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8" role="main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
    </div>
  );
}
