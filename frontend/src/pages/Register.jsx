import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <Layout>
      <Card className="max-w-md w-full mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-cyber-primary/10 rounded-2xl flex items-center justify-center border border-cyber-primary/25 mb-4">
            <Shield className="w-6 h-6 text-cyber-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create SecOps Profile</h2>
          <p className="text-slate-500 text-sm mt-1 text-center font-medium">
            Register an analyst key to log scans and download audit reports
          </p>
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Analyst Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Drashti Patel"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyber-primary focus:bg-white focus:ring-2 focus:ring-cyber-primary/10 transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Security Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@phishguard.ai"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyber-primary focus:bg-white focus:ring-2 focus:ring-cyber-primary/10 transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyber-primary focus:bg-white focus:ring-2 focus:ring-cyber-primary/10 transition-all duration-300"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Provision Profile</span>
            )}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-slate-500 font-semibold">
          Already have an analyst account?{' '}
          <Link to="/login" className="text-cyber-primary hover:underline transition-all">Sign In</Link>
        </div>
      </Card>
    </Layout>
  );
};

export default Register;
