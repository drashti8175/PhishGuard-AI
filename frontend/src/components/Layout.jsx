import React, { useEffect, useState } from 'react';

// Layout component that provides a 4‑sided quote frame (light theme)
const Layout = ({ children }) => {
  // Light theme is default; optional toggle can be kept if needed
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return false; // start in light mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-20 p-2 bg-cyber-primary/10 rounded-full hover:bg-cyber-primary/20 transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Main content area */}
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
