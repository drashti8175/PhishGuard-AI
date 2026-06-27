import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Mail, FileSearch, Activity,
  History, FileBarChart, Bot, Award, UserCircle,
  ShieldCheck, QrCode, ChevronRight
} from 'lucide-react';

const GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Real-time SOC metrics' },
    ]
  },
  {
    label: 'Scanners',
    items: [
      { to: '/',              label: 'URL Scanner',   icon: Globe,       desc: 'Detect phishing URLs'     },
      { to: '/email-scanner', label: 'Email Detector',icon: Mail,        desc: 'Email threat analysis'    },
      { to: '/file-scanner',  label: 'File Scanner',  icon: FileSearch,  desc: 'Malware detection'        },
      { to: '/qr-scanner',    label: 'QR Scanner',    icon: QrCode,      desc: 'QR code analysis'         },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/threat-intel',  label: 'Threat Intel',  icon: Activity,    desc: 'Global threat feed'       },
      { to: '/history',       label: 'Scan History',  icon: History,     desc: 'Past scan logs'           },
      { to: '/reports',       label: 'Reports',       icon: FileBarChart,desc: 'Export analytics'         },
    ]
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/ai-chat',        label: 'AI Assistant',  icon: Bot,         desc: 'Chat with security AI'   },
      { to: '/security-score', label: 'Security Score',icon: Award,       desc: 'Your security health'    },
    ]
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'User Profile', icon: UserCircle, desc: 'Account & settings' },
      { to: '/admin',   label: 'Admin Panel',  icon: ShieldCheck, desc: 'Platform management' },
    ]
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[220px] min-h-[calc(100vh-62px)] bg-white border-r border-slate-200/80 flex flex-col overflow-y-auto shrink-0">

      {/* Status strip */}
      <div className="m-3 mb-1 p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-blue-200" />
          <span className="text-[11px] font-black text-white uppercase tracking-wider">PhishGuard AI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" style={{ width: 5, height: 5 }} />
          <span className="text-[10px] font-bold text-emerald-300">All Systems Active</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2.5 py-3 space-y-4">
        {GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.14em] px-3 mb-1.5">{label}</p>
            <div className="space-y-0.5">
              {items.map(({ to, label: lbl, icon: Icon }) => {
                const active = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to);
                return (
                  <NavLink key={to} to={to} end={to === '/'}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                      active
                        ? 'nav-item-active'
                        : 'nav-item-base'
                    }`}>
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{lbl}</span>
                    {active && <ChevronRight className="w-3 h-3 text-blue-400 ml-auto shrink-0" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom tip card */}
      <div className="m-3 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
        <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-1.5">💡 Pro Tip</p>
        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
          Use the AI Assistant to explain any scan result in plain language.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
