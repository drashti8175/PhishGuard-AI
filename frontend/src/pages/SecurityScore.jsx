import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Zap, Lock, Globe, Mail, FileText } from 'lucide-react';

const CHECKS = [
  { label: '2FA Enabled', key: 'twofa', points: 15, icon: Lock, tip: 'Enable Two-Factor Authentication in your profile.' },
  { label: 'Strong Password Set', key: 'password', points: 10, icon: Lock, tip: 'Use a password with 12+ chars, symbols, and numbers.' },
  { label: 'URL Scans This Week', key: 'urlscans', points: 20, icon: Globe, tip: 'Scan at least 5 URLs per week.' },
  { label: 'Email Checks Performed', key: 'emailscans', points: 20, icon: Mail, tip: 'Analyze suspicious emails using the Email Detector.' },
  { label: 'File Scans Performed', key: 'filescans', points: 15, icon: FileText, tip: 'Upload and scan files before opening them.' },
  { label: 'Threat Intel Reviewed', key: 'threatintel', points: 10, icon: AlertTriangle, tip: 'Check the Threat Intelligence page regularly.' },
  { label: 'No Threats Ignored', key: 'nothreats', points: 10, icon: ShieldCheck, tip: 'All detected threats have been reviewed.' },
];

const getScoreColor = (score) => {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Excellent', ring: 'stroke-emerald-500' };
  if (score >= 60) return { text: 'text-blue-600', bg: 'bg-blue-500', label: 'Good', ring: 'stroke-blue-500' };
  if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-500', label: 'Fair', ring: 'stroke-amber-500' };
  return { text: 'text-red-600', bg: 'bg-red-500', label: 'At Risk', ring: 'stroke-red-500' };
};

const ScoreRing = ({ score }) => {
  const { text, ring, label } = getScoreColor(score);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg width="160" height="160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle cx="80" cy="80" r={r} fill="none" className={ring} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-black ${text}`}>{score}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
        <span className={`text-xs font-black ${text} mt-1`}>{label}</span>
      </div>
    </div>
  );
};

const SecurityScore = () => {
  const [checked, setChecked] = useState({
    twofa: false, password: true, urlscans: true, emailscans: false,
    filescans: true, threatintel: false, nothreats: true
  });

  const score = CHECKS.reduce((acc, c) => acc + (checked[c.key] ? c.points : 0), 0);
  const { text, label } = getScoreColor(score);

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600 animate-pulse" />
            Security Score
          </h1>
          <p className="text-slate-500 text-sm font-medium">Your personal cybersecurity health rating based on completed security actions.</p>
        </div>

        {/* Score Card */}
        <div className="glass-panel rounded-3xl p-8 bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <ScoreRing score={score} />
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Your Security Status</p>
                <p className={`text-2xl font-black ${text} mt-1`}>{label} Security Posture</p>
                <p className="text-sm text-slate-500 font-medium mt-2">
                  {score >= 80
                    ? 'Excellent! You follow strong security practices. Keep it up.'
                    : score >= 60
                    ? 'Good progress. Complete the remaining checks to improve your score.'
                    : 'Your account needs attention. Complete the checklist below to improve.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <span>Progress</span><span>{score}/100 pts</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${getScoreColor(score).bg}`}
                    style={{ width: `${score}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 font-semibold">
                  {100 - score > 0
                    ? `Complete ${CHECKS.filter(c => !checked[c.key]).length} more action${CHECKS.filter(c => !checked[c.key]).length !== 1 ? 's' : ''} to reach 100/100.`
                    : 'Perfect score! Your account is fully secured.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Security Checklist
          </h3>
          <div className="space-y-3">
            {CHECKS.map(({ label, key, points, icon: Icon, tip }) => (
              <div key={key}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  checked[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggle(key)}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${checked[key] ? 'bg-emerald-100' : 'bg-white border border-slate-200'}`}>
                  <Icon className={`w-4 h-4 ${checked[key] ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${checked[key] ? 'text-emerald-800 line-through opacity-70' : 'text-slate-800'}`}>{label}</p>
                  {!checked[key] && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{tip}</p>}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${checked[key] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  +{points} pts
                </span>
                {checked[key]
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  : <XCircle className="w-5 h-5 text-slate-300 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecurityScore;
