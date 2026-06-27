import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Activity, AlertTriangle, Eye, Ban, Trash2, 
  TrendingUp, BarChart3, UserPlus, Server, Database, Brain, Cpu, CheckCircle2 
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Blocked' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'Active' },
  ]);

  const [threats, setThreats] = useState([
    { id: 1, url: 'fake-paypal-login.xyz', type: 'Phishing', risk: 'High', date: 'Jun 11, 2026', status: 'Active' },
    { id: 2, url: 'login-update-secure.net', type: 'Malware', risk: 'Critical', date: 'Jun 10, 2026', status: 'Active' },
    { id: 3, url: 'verify-bank-account.com', type: 'Phishing', risk: 'High', date: 'Jun 9, 2026', status: 'Resolved' },
    { id: 4, url: 'free-prize-winner.org', type: 'Scam', risk: 'Medium', date: 'Jun 8, 2026', status: 'Active' },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { action: 'User login verification', user: 'bob@example.com', time: '10 mins ago', status: 'Success' },
    { action: 'Phishing scan processed', user: 'diana@example.com', time: '14 mins ago', status: 'Flagged' },
    { action: '2FA settings modified', user: 'alice@example.com', time: '1 hour ago', status: 'Success' },
    { action: 'Admin dashboard metrics compiled', user: 'System Task', time: '2 hours ago', status: 'Success' }
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('User');

  // Overview Cards Data
  const systemStats = [
    { label: 'Total Users', value: users.length, icon: Users, cls: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, icon: TrendingUp, cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Total Threats', value: threats.length, icon: AlertTriangle, cls: 'bg-red-50 text-red-600 border-red-200' },
    { label: 'System Health', value: '99.9%', icon: Activity, cls: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  const modelMetrics = [
    { label: 'Accuracy', value: '98.4%', color: 'text-blue-600' },
    { label: 'Precision', value: '97.2%', color: 'text-purple-600' },
    { label: 'Recall', value: '96.8%', color: 'text-emerald-600' },
    { label: 'F1 Score', value: '97.0%', color: 'text-amber-600' },
  ];

  const riskColors = { 
    High: 'bg-red-50 text-red-600 border-red-200', 
    Critical: 'bg-red-100 text-red-700 border-red-300', 
    Medium: 'bg-amber-50 text-amber-600 border-amber-200', 
    Low: 'bg-emerald-50 text-emerald-600 border-emerald-200' 
  };

  // User Actions
  const toggleBlockUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u));
    logAdminAction(`Modified status for User ID ${id}`);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      logAdminAction(`Deleted User ID ${id}`);
    }
  };

  const promoteToAdmin = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'Admin' } : u));
    logAdminAction(`Promoted User ID ${id} to Admin`);
  };

  const startEditUser = (user) => {
    setEditingUser(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const saveEditUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name: editName, email: editEmail, role: editRole } : u));
    setEditingUser(null);
    logAdminAction(`Updated details for User ID ${id}`);
  };

  // Threat Actions
  const markThreatResolved = (id) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    logAdminAction(`Marked Threat ID ${id} as Resolved`);
  };

  const assignSeverity = (id, newSeverity) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, risk: newSeverity } : t));
    logAdminAction(`Assigned Severity ${newSeverity} to Threat ID ${id}`);
  };

  const logAdminAction = (action) => {
    const newLog = {
      action,
      user: 'admin@charotar.ac.in',
      time: 'Just now',
      status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600 animate-pulse" />
            Admin Operations Center
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage platform registrations, audit threats, verify system status, and examine model parameters.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((s) => { 
            const I = s.icon; 
            return (
              <div key={s.label} className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex items-center gap-4 hover:translate-y-[-2px] transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.cls}`}>
                  <I className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">{s.value}</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{s.label}</span>
                </div>
              </div>
            ); 
          })}
        </div>

        {/* System Monitoring Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Health */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-blue-500 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">FastAPI Server</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Port 8000</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
              ACTIVE
            </span>
          </div>

          {/* Database Health */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">MongoDB Adapter</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Lifespan context active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
              CONNECTED
            </span>
          </div>

          {/* AI Predictor Health */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-amber-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">AI Inference Engine</span>
                <span className="text-[10px] text-slate-400 font-semibold block">scikit-learn active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
              READY
            </span>
          </div>
        </div>

        {/* User Management */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> User Management
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-widest">
                  <th className="pb-3">User Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">System Role</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5">
                      {editingUser === u.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-semibold"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{u.name}</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {editingUser === u.id ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-semibold"
                        />
                      ) : (
                        <span className="text-slate-500 font-medium">{u.email}</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {editingUser === u.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-semibold"
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          u.role === 'Admin' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {editingUser === u.id ? (
                          <button
                            onClick={() => saveEditUser(u.id)}
                            className="bg-blue-600 text-white text-[10px] font-bold py-1 px-2.5 rounded hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditUser(u)}
                              className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                              title="Edit User"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {u.role !== 'Admin' && (
                              <button
                                onClick={() => promoteToAdmin(u.id)}
                                className="p-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all cursor-pointer text-[9px] font-bold px-2"
                                title="Promote to Admin"
                              >
                                Promote
                              </button>
                            )}
                            <button
                              onClick={() => toggleBlockUser(u.id)}
                              className="p-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-lg text-slate-500 hover:text-amber-600 transition-all cursor-pointer"
                              title={u.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Management */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> Threat Management Panel
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-widest">
                  <th className="pb-3">Threat URL</th>
                  <th className="pb-3">Threat Type</th>
                  <th className="pb-3 text-center">Severity</th>
                  <th className="pb-3 text-center">Resolution Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {threats.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800 truncate max-w-[200px]" title={t.url}>{t.url}</td>
                    <td className="py-3.5 text-slate-500">{t.type}</td>
                    <td className="py-3.5 text-center">
                      <select
                        value={t.risk}
                        onChange={(e) => assignSeverity(t.id, e.target.value)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border focus:outline-none ${riskColors[t.risk]}`}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {t.status !== 'Resolved' && (
                        <button
                          onClick={() => markThreatResolved(t.id)}
                          className="bg-emerald-600 text-white text-[9px] font-bold py-1.5 px-3 rounded hover:bg-emerald-700 cursor-pointer transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Performance and System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Performance */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" /> AI Classification Engine Diagnostics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {modelMetrics.map((m) => (
                <div key={m.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className={`text-2xl font-black ${m.color} block`}>{m.value}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" /> System Audit Logs
            </h3>
            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-[10px] font-semibold text-slate-600">
                  <div className="space-y-0.5">
                    <span className="text-slate-800 block truncate max-w-[150px]">{log.action}</span>
                    <span className="text-slate-400 text-[9px] block">{log.user}</span>
                  </div>
                  <span className="text-slate-400 text-[9px]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
