import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LogOut, LayoutDashboard, User, ChevronDown,
  Zap, Globe, Mail, FileSearch, Activity, Bot
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/',              label: 'URL Scanner'  },
  { to: '/email-scanner', label: 'Email Scan'   },
  { to: '/file-scanner',  label: 'File Scan'    },
  { to: '/threat-intel',  label: 'Threat Intel' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef                   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/home'); setDropOpen(false); };

  const isPublic = ['/home', '/login', '/register'].includes(location.pathname);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/97 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-200/80'
        : 'bg-white/90 backdrop-blur-md border-b border-slate-200/60'
    }`}>
      <div className="max-w-[1400px] mx-auto px-5 h-[62px] flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/home" className="flex items-center gap-2.5 select-none group shrink-0">
          <div className="relative w-9 h-9 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/35 group-hover:shadow-blue-500/55 group-hover:scale-105 transition-all duration-300" />
            <Shield className="absolute inset-0 m-auto w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="block text-[15px] font-black text-slate-900 tracking-tight">PhishGuard</span>
            <span className="block text-[9px] font-black text-blue-600 uppercase tracking-[0.15em] mt-0.5">AI Security</span>
          </div>
        </Link>

        {/* ── Center links (hide on auth/landing pages) ── */}
        {!isPublic && (
          <div className="hidden md:flex items-center gap-0.5 bg-slate-100/70 rounded-xl p-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                  location.pathname === to
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Right ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live status pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1.5">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span className="text-[11px] font-bold text-emerald-700">AI Active</span>
          </div>

          {user ? (
            <>
              {/* Dashboard shortcut */}
              <Link to="/dashboard"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold shadow-md shadow-blue-500/30 transition-all">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(o => !o)}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200/80">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-700 max-w-[72px] truncate hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropOpen?'rotate-180':''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 overflow-hidden z-50 animate-fadeIn">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* Menu items */}
                    {[
                      { to: '/profile',        label: '👤  My Profile'      },
                      { to: '/security-score', label: '🛡️  Security Score'  },
                      { to: '/ai-chat',        label: '🤖  AI Assistant'    },
                      { to: '/admin',          label: '⚙️  Admin Panel'     },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setDropOpen(false)}
                        className="flex items-center px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100">
                Sign In
              </Link>
              <Link to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
