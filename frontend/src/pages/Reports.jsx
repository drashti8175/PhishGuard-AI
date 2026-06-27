import React, { useState } from 'react';
import { 
  FileBarChart, Globe, Mail, FileText, Download, FileDown, 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  Calendar, FileSpreadsheet, FileJson, Sparkles, AlertCircle 
} from 'lucide-react';

const Reports = () => {
  const [generating, setGenerating] = useState(null);
  const [reportType, setReportType] = useState('Weekly'); // 'Daily', 'Weekly', 'Monthly'
  const [exporting, setExporting] = useState(null); // null, 'pdf', 'excel', 'csv'

  // Mock stats depending on selected duration type
  const statsConfig = {
    Daily: { scans: 48, threats: 4, topCategory: 'Credential Phishing (URLs)', aiSummary: "Threat vectors were relatively low today. Minor credential phishing campaign was intercepted targeting local banking clients." },
    Weekly: { scans: 342, threats: 28, topCategory: 'Bank Impersonation (Email)', aiSummary: "Active social engineering spikes identified mid-week. 15 domains related to regional banks blocked. Recommend maintaining standard DNS blacklist policies." },
    Monthly: { scans: 1482, threats: 156, topCategory: 'Malicious attachments (Files)', aiSummary: "Significant escalation in zip archive payloads mimicking invoice spreadsheets. Ransomware strains (LockBit) detected in EXE scans. Ensure all endpoints upgrade Windows Defender signatures." }
  };

  const currentStats = statsConfig[reportType];

  const handleGenerateReport = (type) => {
    setGenerating(type);
    setTimeout(() => {
      setGenerating(null);
      setReportType(type);
      alert(`${type} security metrics loaded and compiled.`);
    }, 1200);
  };

  const handleExport = (format) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`Report exported as ${format.toUpperCase()} successfully.`);
    }, 1500);
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FileBarChart className="w-8 h-8 text-blue-600 animate-pulse" />
            Threat Analytics Reports
          </h1>
          <p className="text-slate-500 text-sm font-medium">Compile daily, weekly, or monthly reports on scanned items and threat categories, then export to PDF, Excel, or CSV.</p>
        </div>

        {/* Report Duration Select Triggers */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Report Cycle</span>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {['Daily', 'Weekly', 'Monthly'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => handleGenerateReport(cycle)}
                disabled={generating !== null}
                className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  reportType === cycle 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {generating === cycle ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : `Compile ${cycle}`}
              </button>
            ))}
          </div>
        </div>

        {/* Report Overview & Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Total Scans Card */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Scans ({reportType})</span>
              <span className="text-2xl font-black text-slate-800 mt-0.5">{currentStats.scans}</span>
            </div>
          </div>

          {/* Threats Found Card */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Threats Blocked ({reportType})</span>
              <span className="text-2xl font-black text-red-600 mt-0.5">{currentStats.threats}</span>
            </div>
          </div>

          {/* Top Threat Category Card */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Top Threat Category</span>
              <span className="text-sm font-black text-slate-800 block truncate max-w-[200px] mt-0.5">{currentStats.topCategory}</span>
            </div>
          </div>

        </div>

        {/* AI summary & Exporting tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Threat Summary */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-bounce" />
                AI Security Insights Summary
              </h3>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{reportType} Overview</span>
            </div>
            
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl leading-relaxed text-xs text-blue-800 font-medium">
              <p className="font-extrabold text-blue-900 mb-1">SecOps Monthly Analytics Log:</p>
              "{currentStats.aiSummary}"
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800">Threat Mitigations Applied</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Configured regional API gateway to drop requests from suspicious hosting servers.</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Flagged {currentStats.threats} elements under phishing and file malware categories in local records.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Download className="w-4 h-4 text-slate-500" />
                Export Compiled Data
              </h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Download the complete {reportType.toLowerCase()} list of scanned URLs, threat ratings, and classification outcomes in your preferred format.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              {/* Export PDF */}
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting !== null}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs cursor-pointer shadow-md"
              >
                {exporting === 'pdf' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FileDown className="w-4 h-4 text-cyan-400" />
                )}
                <span>Export PDF Document</span>
              </button>

              {/* Export Excel */}
              <button
                onClick={() => handleExport('excel')}
                disabled={exporting !== null}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs cursor-pointer border border-slate-200"
              >
                {exporting === 'excel' ? (
                  <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                )}
                <span>Export Excel Sheet</span>
              </button>

              {/* Export CSV */}
              <button
                onClick={() => handleExport('csv')}
                disabled={exporting !== null}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs cursor-pointer border border-slate-200"
              >
                {exporting === 'csv' ? (
                  <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FileJson className="w-4 h-4 text-blue-600" />
                )}
                <span>Export CSV Raw File</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
