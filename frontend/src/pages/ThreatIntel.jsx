import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import {
  Radio, ShieldAlert, Globe, Activity, AlertTriangle,
  Sparkles, TrendingUp, Clock, CheckCircle2, XCircle, Eye
} from 'lucide-react';

const FALLBACK = [
  { threat: 'Cobalt Strike Beacon Outbreak',    severity: 'Critical', source: 'Malware Feed',     status: 'Active',    timestamp: '10:32 AM', details: 'Anomalous outbound connections matching Cobalt Strike beacons on port 443. Isolate affected endpoints immediately.' },
  { threat: 'Dynamic Bank Spoofing Campaign',   severity: 'Critical', source: 'PhishGuard Intel',  status: 'Mitigated', timestamp: '11:15 AM', details: 'Campaign registering NameCheap domains using brand-impersonating strings targeting regional banks.' },
  { threat: 'Exchange Server CVE-2026-4412',     severity: 'High',     source: 'CISA KEV',          status: 'Active',    timestamp: '11:45 AM', details: 'Remote code execution vulnerability being actively exploited in the wild. Patch immediately.' },
  { threat: 'Apache Struts RCE Scan Activity',  severity: 'Medium',   source: 'HoneyPot Feed',     status: 'Monitoring',timestamp: '12:01 PM', details: 'High-frequency scans targeting outdated Struts library configurations.' },
  { threat: 'LockBit 3.0 Ransomware Variant',   severity: 'Critical', source: 'Threat Feed',       status: 'Active',    timestamp: '01:22 PM', details: 'LockBit variants targeting SMB shared directories. Block ports 445 and 139 immediately.' },
];

const COORDS = [
  { name: 'North America', ip: '198.51.100.42', x: 22, y: 34, status: 'Active Attack Node',           severity: 'Critical' },
  { name: 'Western Europe', ip: '203.0.113.88', x: 47, y: 28, status: 'Phishing Redirect Host',        severity: 'High'     },
  { name: 'East Asia',      ip: '192.0.2.115',  x: 76, y: 40, status: 'Botnet C2 Server',              severity: 'Critical' },
  { name: 'South America',  ip: '198.18.0.77',  x: 30, y: 68, status: 'Credential Harvesting Gateway', severity: 'Medium'   },
  { name: 'South Asia',     ip: '103.21.244.0', x: 63, y: 48, status: 'Phishing Kit Distribution',    severity: 'High'     },
];

const SEV_BADGE = {
  Critical: 'bg-red-50 text-red-600 border border-red-200',
  High:     'bg-orange-50 text-orange-600 border border-orange-200',
  Medium:   'bg-amber-50 text-amber-600 border border-amber-200',
  Low:      'bg-blue-50 text-blue-600 border border-blue-200',
};

const STATUS_BADGE = {
  Active:     'bg-red-50 text-red-600 border border-red-200',
  Mitigated:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Monitoring: 'bg-amber-50 text-amber-600 border border-amber-200',
};

const ThreatIntel = () => {
  const [threats, setThreats]           = useState(FALLBACK);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(FALLBACK[0]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await API.get('/api/threat-intel');
        if (res.data?.length) { setThreats(res.data); setSelected(res.data[0]); }
      } catch { /* use fallback */ }
      setLoading(false);
    };
    fetch_();
  }, []);

  if (loading) return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pulse-dot-red" style={{ width: 7, height: 7 }} />
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Intelligence Feed</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Radio className="w-6 h-6 text-blue-600" />
              Global Threat Intelligence
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Real-time SOC monitoring · Attack vectors · AI predictions</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <span className="pulse-dot-red" style={{ width: 7, height: 7 }} />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Stream Active</span>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Threats',    value: threats.filter(t => t.status === 'Active').length,    icon: ShieldAlert,   gradient: 'stat-gradient-red',    color: 'text-red-600'    },
            { label: 'Critical Alerts',   value: threats.filter(t => t.severity === 'Critical').length, icon: AlertTriangle, gradient: 'stat-gradient-amber',  color: 'text-amber-600'  },
            { label: 'Monitored Regions', value: COORDS.length,                                          icon: Globe,         gradient: 'stat-gradient-blue',   color: 'text-blue-600'   },
            { label: 'Mitigated Today',   value: threats.filter(t => t.status === 'Mitigated').length,  icon: CheckCircle2,  gradient: 'stat-gradient-green',  color: 'text-emerald-600'},
          ].map(({ label, value, icon: Icon, gradient, color }) => (
            <div key={label} className={`${gradient} stat-card card-hover rounded-2xl p-5`}>
              <div className={`w-9 h-9 bg-white/70 rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Map + Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Global Attack Map */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Global Attack Vector Map
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Live threat origin coordinates</p>
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Real-time</span>
            </div>

            {/* Map area */}
            <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200" style={{ height: 280 }}>
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* World map SVG outline */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Americas */}
                <path d="M80,60 Q100,50 130,70 Q150,90 140,130 Q130,170 120,200 Q110,230 100,250 Q90,270 85,290 Q80,310 90,330 Q95,340 85,350 Q75,355 70,340 Q60,310 65,280 Q70,250 75,220 Q78,190 72,160 Q65,130 70,100 Q74,80 80,60Z" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5"/>
                {/* Europe/Africa */}
                <path d="M340,40 Q370,35 400,50 Q420,65 415,90 Q410,110 420,140 Q430,165 420,195 Q415,220 410,250 Q400,280 390,310 Q375,335 360,345 Q345,350 340,330 Q332,305 335,275 Q338,245 330,215 Q322,185 325,155 Q328,125 322,95 Q317,65 325,50 Q332,42 340,40Z" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.25)" strokeWidth="1.5"/>
                {/* Asia */}
                <path d="M460,30 Q510,20 570,35 Q620,50 650,80 Q670,105 660,135 Q648,165 640,195 Q630,220 615,240 Q595,255 570,260 Q545,262 520,250 Q498,238 480,215 Q462,190 458,160 Q454,130 458,100 Q462,65 460,30Z" fill="rgba(124,58,237,0.1)" stroke="rgba(124,58,237,0.25)" strokeWidth="1.5"/>
                {/* Australia */}
                <path d="M590,280 Q625,270 650,285 Q670,300 665,325 Q658,348 635,355 Q610,360 592,345 Q575,330 578,308 Q581,290 590,280Z" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5"/>
              </svg>

              {/* Attack nodes */}
              {COORDS.map((c, i) => (
                <div key={i} className="absolute group cursor-pointer z-10"
                  style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-50%)' }}>
                  {/* Ping ring */}
                  <span className={`absolute inline-flex w-5 h-5 rounded-full -left-0.5 -top-0.5 animate-ping opacity-60 ${c.severity === 'Critical' ? 'bg-red-400' : c.severity === 'High' ? 'bg-orange-400' : 'bg-amber-400'}`} />
                  {/* Dot */}
                  <span className={`relative inline-flex w-4 h-4 rounded-full border-2 border-white shadow-lg ${c.severity === 'Critical' ? 'bg-red-500' : c.severity === 'High' ? 'bg-orange-500' : 'bg-amber-500'}`} />
                  {/* Tooltip */}
                  <div className="absolute left-6 -top-8 bg-white border border-slate-200 shadow-xl rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 min-w-[180px]">
                    <p className="text-xs font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">IP: {c.ip}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${c.severity === 'Critical' ? 'text-red-600' : c.severity === 'High' ? 'text-orange-600' : 'text-amber-600'}`}>{c.status}</p>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-white/80 backdrop-blur rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
                {[
                  { color: 'bg-red-500', label: 'Critical' },
                  { color: 'bg-orange-500', label: 'High' },
                  { color: 'bg-amber-500', label: 'Medium' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-[10px] font-bold text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Active Threat Feed
              </h3>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-wider animate-pulse">● Streaming</span>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
              {threats.map((t, i) => (
                <div key={i} onClick={() => setSelected(t)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selected?.threat === t.threat
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{t.threat}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0 ${SEV_BADGE[t.severity] || SEV_BADGE.Medium}`}>{t.severity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-400">{t.source}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{t.timestamp || 'Just now'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected threat detail */}
            {selected && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">AI Recommendation</span>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-slate-800 mb-1">{selected.threat}</p>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{selected.details || 'Isolate affected systems and review firewall rules immediately.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Intel Reports ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              badge: 'Active Phishing Campaign', badgeColor: 'badge-danger',
              title: 'OAuth Consent Impersonation',
              icon: ShieldAlert, iconColor: 'text-red-600', iconBg: 'bg-red-50',
              desc: 'New campaigns targeting corporate Microsoft 365 logins. Users redirected via fake OAuth apps to authorize malicious permissions.',
              tag: 'Critical · Microsoft 365'
            },
            {
              badge: 'Malware Outbreak', badgeColor: 'badge-warning',
              title: 'LockBit 3.0 Ransomware',
              icon: AlertTriangle, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
              desc: 'LockBit variants use custom packer binaries targeting SMB shared directories. Block external traffic on ports 445 and 139.',
              tag: 'High · SMB / Windows'
            },
            {
              badge: 'Vulnerability Alert', badgeColor: 'bg-blue-50 text-blue-600 border border-blue-200',
              title: 'OpenSSL Buffer Overflow',
              icon: Activity, iconColor: 'text-blue-600', iconBg: 'bg-blue-50',
              desc: 'Vulnerability in OpenSSL prior to 3.0.7 allows remote code execution. Urgently upgrade all servers to the latest release.',
              tag: 'High · OpenSSL < 3.0.7'
            },
          ].map(({ badge, badgeColor, title, icon: Icon, iconColor, iconBg, desc, tag }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${badgeColor}`}>{badge}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <Clock className="w-3 h-3" /> {tag}
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Threat Prediction ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> AI Threat Prediction
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Probability forecast for the next 7 days</p>
            </div>
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">Predictive Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Phishing Campaign Surge',  prob: 87, color: 'bg-red-500',    gradient: 'stat-gradient-red',    textColor: 'text-red-600',    detail: 'High probability of new banking phishing domains targeting regional financial institutions.' },
              { label: 'Credential Harvesting',    prob: 72, color: 'bg-amber-500',  gradient: 'stat-gradient-amber',  textColor: 'text-amber-600',  detail: 'Fake Microsoft 365 login pages expected to spike mid-week via spear-phishing campaigns.' },
              { label: 'Ransomware Deployment',    prob: 54, color: 'bg-purple-500', gradient: 'stat-gradient-purple', textColor: 'text-purple-600', detail: 'LockBit variant honeypot activity elevated. SMB environments at increased risk this week.' },
            ].map(({ label, prob, color, gradient, textColor, detail }) => (
              <div key={label} className={`${gradient} rounded-2xl p-5 border border-slate-100`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-slate-800">{label}</span>
                  <span className={`text-xl font-black ${textColor}`}>{prob}%</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className={`progress-fill ${color}`} style={{ width: `${prob}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThreatIntel;
