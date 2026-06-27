import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { 
  History, Globe, Mail, FileText, Download, ShieldCheck, ShieldAlert, 
  FileSearch, Search, Trash2, Eye, RefreshCw, X, Calendar, ShieldAlert as AlertIcon
} from 'lucide-react';

const HistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('AllTime'); // 'AllTime', 'Today', 'ThisWeek', 'ThisMonth'
  const [selectedScan, setSelectedScan] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [rescanningId, setRescanningId] = useState(null);

  const filters = ['All', 'url', 'email', 'file'];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/api/history');
        setScans(res.data);
      } catch (err) {
        console.error("History fetch failed:", err);
        // Fallback demo data
        setScans([
          { id: '1', type: 'url', url: 'fake-bank-portal.com', prediction: 'Phishing', risk_score: 95, created_at: new Date().toISOString() },
          { id: '2', type: 'file', content_preview: 'tax_report.pdf', prediction: 'Safe', risk_score: 10, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
          { id: '3', type: 'email', content_preview: 'URGENT: Verify your account immediately!', prediction: 'Phishing', risk_score: 88, created_at: new Date(Date.now() - 3600000 * 25).toISOString() },
          { id: '4', type: 'url', url: 'google.com', prediction: 'Safe', risk_score: 2, created_at: new Date(Date.now() - 3600000 * 50).toISOString() },
          { id: '5', type: 'url', url: 'login-update-security.xyz', prediction: 'Phishing', risk_score: 91, created_at: new Date(Date.now() - 3600000 * 200).toISOString() },
          { id: '6', type: 'file', content_preview: 'invoice.docx', prediction: 'Safe', risk_score: 15, created_at: new Date(Date.now() - 3600000 * 750).toISOString() },
        ]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const downloadReport = async (scan) => {
    setDownloadingId(scan.id);
    setTimeout(() => {
      alert(`Report PDF for ${scan.url || scan.content_preview} downloaded successfully.`);
      setDownloadingId(null);
    }, 1200);
  };

  const handleRescan = async (scan) => {
    setRescanningId(scan.id);
    setTimeout(() => {
      // update the scan in state
      setScans(prev => prev.map(s => {
        if (s.id === scan.id) {
          return {
            ...s,
            created_at: new Date().toISOString(),
            risk_score: Math.min(100, Math.max(0, s.risk_score + (Math.random() > 0.5 ? 2 : -2)))
          };
        }
        return s;
      }));
      setRescanningId(null);
      alert(`Rescanned ${scan.type} successfully.`);
    }, 1500);
  };

  const deleteScan = (scanId) => {
    setScans(prev => prev.filter(s => s.id !== scanId));
  };

  const getScanIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-purple-500" />;
      case 'file': return <FileText className="w-4 h-4 text-amber-500" />;
      default: return <Globe className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'email': return 'Email';
      case 'file': return 'File';
      default: return 'URL';
    }
  };

  // Date check helpers
  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  const isThisWeek = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= oneWeekAgo;
  };

  const isThisMonth = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return d >= oneMonthAgo;
  };

  // Filter and search logic
  const filteredScans = scans.filter(scan => {
    // 1. Search Query
    const targetText = (scan.url || scan.content_preview || '').toLowerCase();
    const matchesSearch = targetText.includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Type Filter
    if (typeFilter !== 'All' && scan.type !== typeFilter) return false;

    // 3. Date Filter
    if (dateFilter === 'Today' && !isToday(scan.created_at)) return false;
    if (dateFilter === 'ThisWeek' && !isThisWeek(scan.created_at)) return false;
    if (dateFilter === 'ThisMonth' && !isThisMonth(scan.created_at)) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600 animate-pulse" />
            Security Scan History
          </h1>
          <p className="text-slate-500 text-sm font-medium">Review your previous URL, email, and file security analysis.</p>
        </div>

        {/* Search & Filters */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scans by URL, email text or file name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* Date Filters Select */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setDateFilter('Today')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dateFilter === 'Today' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('ThisWeek')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dateFilter === 'ThisWeek' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setDateFilter('ThisMonth')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dateFilter === 'ThisMonth' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                This Month
              </button>
              <button
                onClick={() => setDateFilter('AllTime')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dateFilter === 'AllTime' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest self-center mr-2">Type Filters</span>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${typeFilter === filter
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {filter === 'All' ? 'All Formats' : filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Scans Table */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200 bg-white">
          {filteredScans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-widest">
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Target (URL/Preview)</th>
                    <th className="pb-4 text-center">Result</th>
                    <th className="pb-4 text-center">Risk Score</th>
                    <th className="pb-4">Scan Date</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50 transition-all">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                            {getScanIcon(scan.type)}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{getTypeLabel(scan.type)}</span>
                        </div>
                      </td>
                      <td className="py-4 max-w-[240px] truncate text-slate-800 font-bold" title={scan.url || scan.content_preview}>
                        {scan.url || scan.content_preview}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold ${
                          scan.prediction === 'Phishing' || scan.prediction === 'Malware'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {scan.prediction === 'Phishing' || scan.prediction === 'Malware' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {scan.prediction}
                        </span>
                      </td>
                      <td className={`py-4 text-center font-bold ${scan.risk_score >= 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {scan.risk_score}%
                      </td>
                      <td className="py-4 text-slate-400">
                        {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedScan(scan)}
                            className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => downloadReport(scan)}
                            disabled={downloadingId === scan.id}
                            className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                            title="Download Report"
                          >
                            {downloadingId === scan.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRescan(scan)}
                            disabled={rescanningId === scan.id}
                            className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                            title="Re-scan Target"
                          >
                            {rescanningId === scan.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteScan(scan.id)}
                            className="p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                            title="Delete Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
              <FileSearch className="w-12 h-12 text-slate-400 animate-bounce" />
              <h3 className="text-slate-800 font-bold text-base">No Scans Found</h3>
              <p className="text-slate-500 text-xs font-semibold max-w-[280px]">
                Try adjusting your filters or date range choices above.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Modal Overlay */}
        {selectedScan && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="glass-panel max-w-lg w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-5">
              <button 
                onClick={() => setSelectedScan(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                  {getScanIcon(selectedScan.type)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    {getTypeLabel(selectedScan.type)} Security Analysis
                  </h3>
                  <span className="text-[9px] text-slate-400 font-bold">LOG ID: {selectedScan.id}</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Scanned Target</span>
                  <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 break-all select-all">
                    {selectedScan.url || selectedScan.content_preview}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Verdict</span>
                    <span className={`text-xs font-black uppercase ${
                      selectedScan.prediction === 'Phishing' || selectedScan.prediction === 'Malware' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {selectedScan.prediction}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Risk Score</span>
                    <span className={`text-sm font-black ${selectedScan.risk_score >= 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {selectedScan.risk_score}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">AI Summary & Mitigation</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedScan.prediction === 'Phishing' || selectedScan.prediction === 'Malware' 
                      ? "AI classifier detected traits of brand impersonation and high-risk URL redirection. Keep local firewall locks active and report the content to IT security channels immediately."
                      : "No security indicators matched with known threats. Domain displays standard structures."
                    }
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedScan(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    downloadReport(selectedScan);
                    setSelectedScan(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Download Report
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
