import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Lock, Eye, EyeOff, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const Toggle = ({ enabled, onChange }) => (
    <button onClick={() => onChange(!enabled)} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6.5' : 'translate-x-0.5'}`}></div>
    </button>
  );

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-cyber-primary" /> Settings
          </h1>
        </div>

        {/* Theme */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Palette className="w-5 h-5 text-purple-600" /> Appearance</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div><span className="text-sm font-bold text-slate-800 block">Dark Mode</span><span className="text-xs text-slate-400">Switch between light and dark theme</span></div>
              </div>
              <Toggle enabled={darkMode} onChange={setDarkMode} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-600" /> Notifications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notifications ? <Bell className="w-5 h-5 text-blue-500" /> : <BellOff className="w-5 h-5 text-slate-400" />}
                <div><span className="text-sm font-bold text-slate-800 block">Push Notifications</span><span className="text-xs text-slate-400">Get notified about scan results</span></div>
              </div>
              <Toggle enabled={notifications} onChange={setNotifications} />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-500" />
                <div><span className="text-sm font-bold text-slate-800 block">Email Alerts</span><span className="text-xs text-slate-400">Receive threat alerts via email</span></div>
              </div>
              <Toggle enabled={emailAlerts} onChange={setEmailAlerts} />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Lock className="w-5 h-5 text-amber-600" /> Password</h2>
          </div>
          <div className="p-6 space-y-4">
            <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Current Password</label><input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase block mb-1">New Password</label><input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer">Update Password</button>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-600" /> Privacy</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div><span className="text-sm font-bold text-slate-800 block">Two-Factor Authentication</span><span className="text-xs text-slate-400">Extra security layer for your account</span></div>
              </div>
              <Toggle enabled={twoFactor} onChange={setTwoFactor} />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-500" />
                <div><span className="text-sm font-bold text-slate-800 block">Activity Visibility</span><span className="text-xs text-slate-400">Control who can see your scan history</span></div>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
