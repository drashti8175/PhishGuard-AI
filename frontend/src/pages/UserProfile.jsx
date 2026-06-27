import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle, Mail, Shield, Calendar, Activity, FileBarChart, 
  AlertTriangle, Lock, Smartphone, LogOut, Camera, Key, CheckCircle,
  Laptop, Globe, ShieldCheck
} from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Local state for forms
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setUpdatingPassword(true);
    setTimeout(() => {
      alert("Password updated successfully.");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setUpdatingPassword(false);
    }, 1500);
  };

  const handleToggle2FA = () => {
    const nextState = !twoFAEnabled;
    setTwoFAEnabled(nextState);
    alert(`Two-Factor Authentication ${nextState ? 'enabled' : 'disabled'} successfully.`);
  };

  const u = user || { 
    name: 'Drashti Patel', 
    email: 'drashti@charotar.ac.in', 
    role: 'Administrator', 
    account_status: 'Active',
    created_at: '2026-01-15T10:00:00Z',
    last_login: new Date().toISOString()
  };

  const loginActivity = [
    { ip: '192.168.1.105', device: 'Chrome on Windows 11', time: 'Just Now', location: 'Anand, India' },
    { ip: '192.168.1.105', device: 'Chrome on Windows 11', time: 'Yesterday, 10:14 AM', location: 'Anand, India' },
    { ip: '198.51.100.22', device: 'Firefox on MacOS', time: 'Jun 10, 2026, 4:45 PM', location: 'Mumbai, India' }
  ];

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-blue-600 animate-pulse" />
            Security Profile Console
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage user account details, authentication parameters, security logs, and stats.</p>
        </div>

        {/* Profile Card */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center relative group">
                <UserCircle className="w-16 h-16 text-blue-600" />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/20">
              Account Status: {u.account_status || 'Active'}
            </div>
          </div>
          <div className="pt-16 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</span>
                <p className="text-base font-black text-slate-800">{u.name}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">{u.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">System Role</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {u.role || 'User'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Joined Date</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Statistics */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Security Activity Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Scans Run</span>
                <span className="text-2xl font-black text-slate-800">1,250</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Threats Reported</span>
                <span className="text-2xl font-black text-red-600">120</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Last Login Timestamp</span>
                <span className="text-xs font-bold text-slate-700 block truncate max-w-[200px]">
                  {new Date(u.last_login).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(u.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Forms & 2FA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Settings Actions & Forms */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" /> Account Security Controls
            </h3>

            {/* 2FA Toggle */}
            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Add secondary verification via authenticator apps.</span>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                  twoFAEnabled ? 'bg-emerald-500 flex justify-end' : 'bg-slate-300 flex justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>

            {/* Change Password Trigger */}
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-all text-xs cursor-pointer text-center"
              >
                Change Account Password
              </button>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4 border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Update Password Form</span>
                <div>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-2 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out of Session</span>
            </button>

          </div>

          {/* Login Activity Logs */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-500" /> Login Activity Log
            </h3>
            
            <div className="divide-y divide-slate-100">
              {loginActivity.map((activity, idx) => (
                <div key={idx} className="py-3.5 flex justify-between items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block">{activity.device}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{activity.ip} • {activity.location}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>All current active login sessions are verified.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfile;
