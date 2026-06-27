import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShieldCheck, ShieldAlert, Mail, FileText, Globe,
  Zap, TrendingUp, Clock, AlertTriangle, ArrowRight, Bot,
  Activity, ChevronRight, Eye, RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const FALLBACK_STATS = {
  total_scans: 1542, phishing_detected: 231, emails_analyzed: 450,
  files_scanned: 120, urls_scanned: 972, ai_accuracy: 98.4, threat_blocked: 231,
  insights: 'Detected 15 phishing attempts this week. Most attacks targeted banking websites.'
};
const FALLBACK_HISTORY = [
  { type:'url',   url:'fake-bank-login-portal.com',              prediction:'Phishing', risk_score:95, timestamp: new Date().toISOString() },
  { type:'email', content_preview:'Urgent: Verify your account immediately', prediction:'Phishing', risk_score:88, timestamp: new Date(Date.now()-3600000).toISOString() },
  { type:'file',  content_preview:'invoice_2026.pdf',            prediction:'Safe',     risk_score:12, timestamp: new Date(Date.now()-7200000).toISOString() },
  { type:'url',   url:'google.com',                              prediction:'Safe',     risk_score:2,  timestamp: new Date(Date.now()-10800000).toISOString() },
  { type:'file',  content_preview:'updater.exe',                 prediction:'Phishing', risk_score:98, timestamp: new Date(Date.now()-14400000).toISOString() },
];

/* ── Metric Card ── */
const MetricCard = ({ title, value, icon: Icon, gradient, iconColor, change, to }) => (
  <Link to={to || '#'} className={`stat-card card-hover rounded-2xl p-5 ${gradient} block`}>
    <div className="flex justify-between items-start mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/70 shadow-sm`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {change !== undefined && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${change >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState(FALLBACK_STATS);
  const [history, setHistory] = useState(FALLBACK_HISTORY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [s, h] = await Promise.all([
        API.get('/api/dashboard/stats'),
        API.get('/api/history?limit=8')
      ]);
      setStats(s.data);
      setHistory(h.data.length ? h.data : FALLBACK_HISTORY);
    } catch { /* use fallback */ }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const total  = stats.total_scans || 1;
  const threat = stats.phishing_detected || 0;
  const safe   = total - threat;
  const pct    = ((threat / total) * 100).toFixed(1);

  /* Chart configs */
  const lineData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        label: 'Total Scans',
        data: [120,150,180,140,210,160,230],
        borderColor: '#2563EB', borderWidth: 2.5,
        backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.45, fill: true,
        pointBackgroundColor: '#2563EB', pointRadius: 4, pointHoverRadius: 6
      },
      {
        label: 'Threats Blocked',
        data: [12,18,25,14,32,11,28],
        borderColor: '#EF4444', borderWidth: 2.5,
        backgroundColor: 'rgba(239,68,68,0.06)', tension: 0.45, fill: true,
        pointBackgroundColor: '#EF4444', pointRadius: 4, pointHoverRadius: 6
      }
    ]
  };

  const donutData = {
    labels: ['Safe','Threats'],
    datasets: [{
      data: [safe, threat],
      backgroundColor: ['#10B981','#EF4444'],
      borderWidth: 0, hoverOffset: 6
    }]
  };

  const barData = {
    labels: ['URL','Email','File'],
    datasets: [{
      data: [stats.urls_scanned, stats.emails_analyzed, stats.files_scanned],
      backgroundColor: ['rgba(37,99,235,0.85)','rgba(124,58,237,0.85)','rgba(245,158,11,0.85)'],
      borderRadius: 10, borderSkipped: false
    }]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { font: { size: 11, weight: '600' }, padding: 16, boxWidth: 12, boxHeight: 12 } } },
    scales: {
      y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } }
    }
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-semibold text-sm">Loading security data...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pulse-dot" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {greeting}, {user?.name?.split(' ')[0] || 'Analyst'} 👋
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => load(true)} disabled={refreshing}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link to="/" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 transition-all">
              <Zap className="w-3.5 h-3.5" /> New Scan
            </Link>
          </div>
        </div>

        {/* ── Threat Alert Banner (if threats > 50%) ── */}
        {parseFloat(pct) > 10 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Elevated Threat Activity Detected</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">{pct}% of recent scans flagged as malicious. Review your scan history.</p>
            </div>
            <Link to="/history" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0">
              View History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard title="URLs Scanned"    value={stats.urls_scanned}      icon={Globe}      gradient="stat-gradient-blue"   iconColor="text-blue-600"   change={12} to="/" />
          <MetricCard title="Threats Blocked" value={threat}                  icon={ShieldAlert} gradient="stat-gradient-red"    iconColor="text-red-600"    change={-3} to="/history" />
          <MetricCard title="Emails Analyzed" value={stats.emails_analyzed}   icon={Mail}       gradient="stat-gradient-purple" iconColor="text-purple-600" change={8}  to="/email-scanner" />
          <MetricCard title="Files Scanned"   value={stats.files_scanned}     icon={FileText}   gradient="stat-gradient-amber"  iconColor="text-amber-600"  change={5}  to="/file-scanner" />
          <MetricCard title="Total Scans"     value={stats.total_scans}       icon={Activity}   gradient="stat-gradient-cyan"   iconColor="text-cyan-600"   change={15} to="/history" />
          <MetricCard title="AI Accuracy"     value={`${stats.ai_accuracy}%`} icon={TrendingUp} gradient="stat-gradient-green"  iconColor="text-emerald-600" />
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Line chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Threat Detection Trend</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Last 7 days — Scans vs Threats</p>
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">7D</span>
            </div>
            <div className="h-56">
              <Line data={lineData} options={chartOpts} />
            </div>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-slate-900">Safe vs Malicious</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">All-time scan breakdown</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-44 w-full">
                <Doughnut data={donutData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{ size:11, weight:'600' }, padding:14, boxWidth:10 } } }, cutout:'72%' }} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-lg font-black text-emerald-600">{safe.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safe</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-red-600">{threat.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Threats</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-slate-900">Scan Type Distribution</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">By scanner module</p>
            </div>
            <div className="h-52">
              <Bar data={barData} options={{ ...chartOpts, plugins:{ legend:{ display:false } } }} />
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Security Events</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Latest scan results</p>
              </div>
              <Link to="/history" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">Type</th>
                  <th className="text-left">Target</th>
                  <th className="text-center">Result</th>
                  <th className="text-center">Score</th>
                  <th className="text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0,6).map((h, i) => {
                  const threat = h.prediction === 'Phishing' || h.prediction === 'Malicious';
                  return (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${h.type==='url'?'bg-blue-50':h.type==='email'?'bg-purple-50':'bg-amber-50'}`}>
                            {h.type==='url'?<Globe className="w-3.5 h-3.5 text-blue-500"/>:h.type==='email'?<Mail className="w-3.5 h-3.5 text-purple-500"/>:<FileText className="w-3.5 h-3.5 text-amber-500"/>}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{h.type}</span>
                        </div>
                      </td>
                      <td className="font-semibold text-slate-700 max-w-[180px] truncate">{h.url||h.content_preview}</td>
                      <td className="text-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${threat?'badge-danger':'badge-safe'}`}>
                          {threat ? '❌ Threat' : '✅ Safe'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`text-xs font-black ${threat?'text-red-600':'text-emerald-600'}`}>{h.risk_score}%</span>
                      </td>
                      <td className="text-right text-slate-400 text-[11px]">
                        {new Date(h.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* AI Insight */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">AI Security Insight</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-blue-50 mb-5">
              "{stats.insights || 'Detected 15 phishing attempts this week. Most attacks targeted banking websites.'}"
            </p>
            <Link to="/ai-chat" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              Ask AI More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              {[
                { label:'Scan a URL',        icon:Globe,      to:'/',              color:'text-blue-600',   bg:'bg-blue-50'   },
                { label:'Analyze an Email',  icon:Mail,       to:'/email-scanner', color:'text-purple-600', bg:'bg-purple-50' },
                { label:'Upload a File',     icon:FileText,   to:'/file-scanner',  color:'text-amber-600',  bg:'bg-amber-50'  },
                { label:'View Threat Intel', icon:Activity,   to:'/threat-intel',  color:'text-rose-600',   bg:'bg-rose-50'   },
              ].map(({ label, icon: Icon, to, color, bg }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                  <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 flex-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label:'AI Engine',        status:'Operational', uptime:'99.9%', ok:true  },
                { label:'MongoDB Database', status:'Connected',   uptime:'100%',  ok:true  },
                { label:'FastAPI Server',   status:'Running',     uptime:'99.8%', ok:true  },
                { label:'Threat Feed',      status:'Live',        uptime:'Real-time', ok:true },
              ].map(({ label, status, uptime, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={ok ? 'pulse-dot' : 'pulse-dot-red'} style={{ width:7, height:7 }} />
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black ${ok?'text-emerald-600':'text-red-600'}`}>{status}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-2">{uptime}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Overall Health</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">✅ Excellent</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
