import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Globe, Mail, FileSearch, Zap, ArrowRight, CheckCircle2,
  ShieldCheck, Lock, BarChart3, Brain, Activity, Star,
  ChevronRight, Award, TrendingUp, AlertTriangle, Bot,
  QrCode, Users, Play, Cpu, Eye
} from 'lucide-react';

/* ── animated counter ── */
const useCounter = (target, duration = 1800) => {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
};

const StatNum = ({ target, suffix = '' }) => {
  const v = useCounter(target);
  return <span>{v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'K' : v}{suffix}</span>;
};

/* ── 3-D Shield Hero Visual ── */
const HeroVisual = () => (
  <div className="relative w-80 h-80 flex items-center justify-center select-none mx-auto">
    {/* Outer rotating rings */}
    <div className="absolute w-80 h-80 rounded-full border border-blue-200/40 animate-spin-slow" />
    <div className="absolute w-64 h-64 rounded-full border border-indigo-200/60 animate-spin-slow-reverse" />
    <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/40 backdrop-blur border border-blue-200/50" />

    {/* Orbiting threat indicators */}
    {[
      { angle: 0,   color: '#EF4444', label: '🚨', size: 9 },
      { angle: 72,  color: '#F59E0B', label: '⚠️', size: 8 },
      { angle: 144, color: '#10B981', label: '✅', size: 9 },
      { angle: 216, color: '#3B82F6', label: '🔍', size: 8 },
      { angle: 288, color: '#8B5CF6', label: '🛡', size: 9 },
    ].map(({ angle, color, label, size }, i) => (
      <div key={i} className="absolute"
        style={{
          transform: `rotate(${angle}deg) translateX(118px)`,
          animation: `spinSlow ${12 + i * 2}s linear infinite`
        }}>
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-sm"
          style={{ transform: `rotate(-${angle}deg)`, boxShadow: `0 4px 14px ${color}40` }}>
          {label}
        </div>
      </div>
    ))}

    {/* Central shield body */}
    <div className="shield-float relative z-10">
      <div className="w-40 h-40 relative">
        {/* Shadow layer */}
        <div className="absolute inset-0 translate-y-3 translate-x-2 rounded-3xl bg-blue-900/20 blur-xl" />
        {/* Main shield */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
            clipPath: 'polygon(50% 0%,100% 18%,100% 62%,50% 100%,0% 62%,0% 18%)',
            boxShadow: '0 20px 60px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          }} />
        {/* Shine */}
        <div className="absolute inset-0 rounded-3xl"
          style={{
            clipPath: 'polygon(50% 0%,100% 18%,100% 62%,50% 100%,0% 62%,0% 18%)',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.25) 0%, transparent 50%)'
          }} />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      </div>
    </div>

    {/* Floating metric badges */}
    <div className="absolute top-2 right-0 animate-bounce-slow" style={{ animationDelay: '0s' }}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-slate-700">98.4% Accuracy</span>
        </div>
      </div>
    </div>
    <div className="absolute bottom-10 -left-4 animate-bounce-slow" style={{ animationDelay: '1.2s' }}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[11px] font-bold text-slate-700">Threat Blocked</span>
        </div>
      </div>
    </div>
    <div className="absolute bottom-24 right-0 animate-bounce-slow" style={{ animationDelay: '0.6s' }}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-bold text-slate-700">AI Active</span>
        </div>
      </div>
    </div>
  </div>
);

/* ── Feature Card ── */
const FEATURES = [
  { icon: Globe,     color: 'blue',    title: 'AI URL Scanner',        desc: 'Real-time ML analysis of domain age, SSL, redirects, blacklists and 40+ features to detect phishing sites instantly.', tag: '10M+ URLs', to: '/' },
  { icon: Mail,      color: 'violet',  title: 'Email Threat Detector', desc: 'NLP-powered scanning of email bodies for urgency tactics, fake sender domains, credential harvesting and malicious links.', tag: '2M+ Emails', to: '/email-scanner' },
  { icon: FileSearch,color: 'amber',   title: 'Deep File Scanner',     desc: 'Static analysis of PDF, DOCX, EXE and ZIP files for embedded payloads, obfuscated scripts and macro exploits.', tag: '500K+ Files', to: '/file-scanner' },
  { icon: Activity,  color: 'rose',    title: 'Threat Intelligence',   desc: 'Live SOC dashboard with global attack vectors, CISA KEV feeds, AI threat predictions and country-level heat maps.', tag: 'Live Feed', to: '/threat-intel' },
  { icon: Bot,       color: 'emerald', title: 'AI Security Assistant', desc: 'Chat with our cybersecurity AI to analyze threats, explain scan results and get expert recommendations instantly.', tag: 'GPT-Powered', to: '/ai-chat' },
  { icon: QrCode,    color: 'indigo',  title: 'QR Code Scanner',       desc: 'Decode and analyze QR codes for hidden malicious URLs, data harvesting payloads and redirect chains.', tag: 'New', to: '/qr-scanner' },
];

const COLOR = {
  blue:   { icon: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100',   glow: 'feature-glow-blue',   bar: 'bg-blue-600'   },
  violet: { icon: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-100', glow: 'feature-glow-purple', bar: 'bg-violet-600' },
  amber:  { icon: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100',  glow: 'feature-glow-amber',  bar: 'bg-amber-500'  },
  rose:   { icon: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-100',   glow: 'feature-glow-rose',   bar: 'bg-rose-500'   },
  emerald:{ icon: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-100',glow: 'feature-glow-emerald',bar: 'bg-emerald-500'},
  indigo: { icon: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100', glow: 'feature-glow-indigo', bar: 'bg-indigo-600' },
};

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'CISO, FinTech Corp',       text: 'PhishGuard blocked 340 phishing attempts in week one. The AI accuracy is genuinely unmatched in the market.', avatar: 'PS' },
  { name: 'Rahul Verma',   role: 'Senior Security Engineer', text: 'The threat intelligence dashboard gives our SOC real-time visibility we could never get from any other tool.', avatar: 'RV' },
  { name: 'Ananya Patel',  role: 'IT Administrator, CHARUSAT',text: 'The AI chat assistant alone saves 4-5 hours a week. It\'s like having a senior analyst available 24/7.', avatar: 'AP' },
];

const TRUST = [
  { icon: Brain,      label: 'ML-Powered',     sub: 'Random Forest + XGBoost' },
  { icon: Zap,        label: 'Sub-Second Scan', sub: '<200ms response time'    },
  { icon: Lock,       label: 'Zero Data Store', sub: 'Privacy-first design'    },
  { icon: Award,      label: '98.4% Accuracy',  sub: 'F1 Score: 97.0'          },
  { icon: Cpu,        label: '40+ Features',    sub: 'Per URL analyzed'        },
  { icon: Eye,        label: 'Live Monitoring', sub: 'Real-time threat feeds'  },
];

const Home = () => (
  <div className="min-h-screen bg-white overflow-x-hidden">

    {/* ════════════════ HERO ════════════════ */}
    <section className="bg-hero bg-hero-mesh grid-pattern relative overflow-hidden px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="orb w-[500px] h-[500px] bg-blue-300 -top-32 -left-32" style={{ opacity: 0.35 }} />
      <div className="orb w-[400px] h-[400px] bg-purple-200 -bottom-20 -right-20" style={{ opacity: 0.3, animationDelay: '4s' }} />
      <div className="orb w-[300px] h-[300px] bg-emerald-200 top-1/2 left-1/2" style={{ opacity: 0.2, animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

        {/* ── Left copy ── */}
        <div className="space-y-8 animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur border border-blue-200 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 bg-blue-600 rounded-full px-2.5 py-1">
              <span className="pulse-dot" style={{ width:6, height:6 }} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
            </div>
            <span className="text-xs font-bold text-slate-700">AI-Powered Cybersecurity Platform · 2026</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl xl:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Stop Phishing &<br />
              <span className="gradient-text">Malware Attacks</span><br />
              With AI Precision
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              PhishGuard AI detects malicious URLs, phishing emails, dangerous files and QR code threats in real-time with <strong className="text-slate-700">98.4% accuracy</strong> — powered by 50,000+ trained threat patterns.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn-primary text-sm">
              <Zap className="w-4 h-4" /> Scan for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="btn-secondary text-sm">
              <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" /> Create Account
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            {['SOC 2 Compliant', 'GDPR Ready', 'ISO 27001', 'Zero Data Retention'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {b}
              </div>
            ))}
          </div>

          {/* Live scan counter strip */}
          <div className="flex items-center gap-6 p-4 bg-white/70 backdrop-blur rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900"><StatNum target={10482} suffix="+" /></p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">URLs Scanned Today</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-red-600"><StatNum target={1204} suffix="+" /></p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Threats Blocked Today</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">98.4%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">AI Accuracy</p>
            </div>
          </div>
        </div>

        {/* ── Right 3D Visual ── */}
        <div className="flex justify-center">
          <HeroVisual />
        </div>
      </div>
    </section>

    {/* ════════════════ STATS BAND ════════════════ */}
    <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 py-14 relative overflow-hidden">
      <div className="orb w-64 h-64 bg-blue-600/20 top-0 left-1/4" style={{ opacity: 0.4 }} />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        {[
          { label: 'URLs Analyzed',   value: '10M+',  sub: 'Since launch',       color: 'text-blue-400'   },
          { label: 'Threats Blocked', value: '500K+', sub: 'Phishing & malware',  color: 'text-red-400'    },
          { label: 'AI Accuracy',     value: '98.4%', sub: 'F1 Score: 97.0',      color: 'text-emerald-400'},
          { label: 'Global Users',    value: '25K+',  sub: 'Security teams',      color: 'text-purple-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="text-center">
            <p className={`text-4xl font-black mb-1 ${color}`}>{value}</p>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ════════════════ FEATURES ════════════════ */}
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Platform Capabilities</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900">Complete Threat Detection Suite</h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Six enterprise-grade security modules working together to protect you from every angle of modern cyber attacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, color, title, desc, tag, to }) => {
            const c = COLOR[color];
            return (
              <Link to={to} key={title} className={`feature-card ${c.glow} tilt-3d block bg-white rounded-3xl p-7 border border-slate-100 hover:border-slate-200`}>
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.bg} ${c.border} border`}>
                    <Icon className={`w-7 h-7 ${c.icon}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${c.bg} ${c.icon} border ${c.border}`}>{tag}</span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-2.5">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">{desc}</p>
                <div className={`flex items-center gap-1.5 text-sm font-bold ${c.icon}`}>
                  Launch Scanner <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    {/* ════════════════ HOW IT WORKS ════════════════ */}
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="orb w-96 h-96 bg-blue-100 -right-24 top-0" style={{ opacity: 0.5 }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl font-black text-slate-900">How It Works</h2>
          <p className="text-slate-500 font-medium">Three steps from suspicious content to actionable security intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300" />

          {[
            { n:'01', icon: Globe,       title:'Submit Content',  desc:'Paste a URL, email body, or upload PDF/EXE/ZIP. All formats accepted instantly.',                                        grad:'from-blue-600 to-blue-700'   },
            { n:'02', icon: Brain,       title:'AI Deep Analysis',desc:'40+ features extracted. Multi-layer ML classification against 50K+ threat patterns and live blacklists.',               grad:'from-indigo-600 to-purple-600'},
            { n:'03', icon: ShieldCheck, title:'Instant Results', desc:'Risk score 0-100, threat indicators, AI explanation and recommended actions delivered in milliseconds.',                  grad:'from-purple-600 to-violet-600'},
          ].map(({ n, icon: Icon, title, desc, grad }) => (
            <div key={n} className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${grad} flex flex-col items-center justify-center shadow-2xl tilt-3d`}
                style={{ boxShadow: '0 20px 48px rgba(37,99,235,0.35)' }}>
                <Icon className="w-12 h-12 text-white mb-1" />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">Step {n}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ════════════════ TRUST GRID ════════════════ */}
    <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-blue-600/15 top-0 right-0" />
      <div className="orb w-60 h-60 bg-violet-600/10 bottom-0 left-0" style={{ animationDelay: '3s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl font-black text-white">Built for Enterprise Security</h2>
          <p className="text-slate-400 font-medium text-lg">Every architectural decision made with accuracy, speed and privacy in mind</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="tilt-3d bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all">
              <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">{label}</p>
              <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
            </div>
          ))}
        </div>

        {/* AI Accuracy metrics bar */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">AI Model Performance</h3>
              <p className="text-slate-400 text-sm font-medium">Trained on 50,000+ labeled phishing & safe samples</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
              <span className="pulse-dot" style={{ width:6, height:6 }} />
              <span className="text-sm font-bold text-emerald-400">Model Active · v3.2</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Accuracy',  val: 98.4, color: 'bg-blue-500'   },
              { label: 'Precision', val: 97.2, color: 'bg-indigo-500' },
              { label: 'Recall',    val: 96.8, color: 'bg-purple-500' },
              { label: 'F1 Score',  val: 97.0, color: 'bg-emerald-500'},
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-black text-white">{val}%</span>
                </div>
                <div className="progress-bar bg-white/10">
                  <div className={`progress-fill ${color}`} style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ════════════════ TESTIMONIALS ════════════════ */}
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-4xl font-black text-slate-900">Trusted by Security Professionals</h2>
          <p className="text-slate-500 font-medium">Real feedback from teams using PhishGuard every day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, text, avatar }) => (
            <div key={name} className="tilt-3d bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6">"{text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400 font-semibold">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ════════════════ CTA ════════════════ */}
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
      <div className="orb w-96 h-96 bg-white/10 -top-20 -left-20" />
      <div className="orb w-64 h-64 bg-white/5 bottom-0 right-10" style={{ animationDelay: '3s' }} />
      <div className="max-w-3xl mx-auto text-center text-white relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2">
          <span className="pulse-dot" style={{ width: 6, height: 6, background: '#34D399' }} />
          <span className="text-xs font-bold">Free to use · No credit card required</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black leading-tight">
          Start Protecting Your<br />Organization Today
        </h2>
        <p className="text-blue-100 font-medium text-lg max-w-xl mx-auto">
          Join 25,000+ security professionals who trust PhishGuard AI to defend against phishing, malware and advanced threats.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register" className="bg-white text-blue-700 font-black px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all inline-flex items-center gap-2">
            <Globe className="w-4 h-4" /> Try URL Scanner
          </Link>
        </div>
        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex -space-x-2">
            {['PS','RV','AP','MK','JD'].map((initials, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white">
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-100 font-semibold ml-1">
            <span className="text-white font-black">+25,000</span> security analysts
          </p>
        </div>
      </div>
    </section>

    {/* ════════════════ FOOTER ════════════════ */}
    <footer className="bg-slate-950 text-slate-400 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-[15px] leading-none">PhishGuard AI</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Security Platform</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-xs">
              AI-powered cybersecurity protecting organizations from phishing, malware, and advanced persistent threats worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span className="text-emerald-400">All systems operational</span>
            </div>
          </div>
          {/* Links */}
          {[
            { label: 'Scanners',  links: ['URL Scanner','Email Detector','File Scanner','QR Scanner'] },
            { label: 'Platform',  links: ['Dashboard','Threat Intel','AI Assistant','Reports'] },
            { label: 'Company',   links: ['Privacy Policy','Terms of Service','Security','Contact'] },
          ].map(({ label, links }) => (
            <div key={label}>
              <p className="text-white font-bold mb-4 text-sm">{label}</p>
              <div className="space-y-2.5">
                {links.map(l => (
                  <p key={l} className="text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors">{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium">© {new Date().getFullYear()} PhishGuard AI. Built with ❤️ for cybersecurity.</p>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <span>Privacy</span><span>Terms</span><span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;
