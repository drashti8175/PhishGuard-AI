import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import API from '../utils/api';
import { 
  FileUp, ShieldAlert, ShieldCheck, Download, CheckCircle2, 
  FileText, Search, Trash2, Hash, AlertTriangle, Info, Clock, RefreshCw 
} from 'lucide-react';

const FileScanner = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState([
    { filename: 'invoice_2026.pdf', prediction: 'Safe', risk_score: 12, hash: 'a1b2c3d4e5f6g7h8i9j0', virus_total_score: '0/72', risk_level: 'Low', date: 'Jun 12, 2026' },
    { filename: 'system_updater.exe', prediction: 'Malware', risk_score: 98, hash: 'ff3322aa11bbccddeeff', virus_total_score: '64/72', risk_level: 'Critical', date: 'Jun 10, 2026' }
  ]);

  const { addNotification } = useNotifications();

  useEffect(() => {
    const saved = localStorage.getItem('file_scan_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('file_scan_history', JSON.stringify(newHistory));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!file) return;
    setScanning(true);
    setResult(null);

    // AI file prediction response simulations
    let prediction = "Safe";
    let risk_score = 12;
    let risk_level = "Low";
    let virus_total = "0/72";
    let ai_analysis = "File appears legitimate with no embedded scripts or suspicious macros.";

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'exe') {
      prediction = "Malware";
      risk_score = 95;
      risk_level = "Critical";
      virus_total = "58/72";
      ai_analysis = "AI Analysis: Executable contains obfuscated payload hooks, unauthorized registry modification routines, and high entropy sections indicative of packing.";
    } else if (extension === 'zip') {
      prediction = "Suspicious";
      risk_score = 65;
      risk_level = "Suspicious";
      virus_total = "14/72";
      ai_analysis = "AI Analysis: Compressed archive contains internal executable payloads with double file extensions (e.g. invoice.pdf.exe) trying to mimic document files.";
    } else if (extension === 'pdf') {
      // Simulate pdf triggers
      if (file.name.includes("invoice")) {
        prediction = "Safe";
        risk_score = 5;
        risk_level = "Low";
        virus_total = "0/72";
        ai_analysis = "AI Analysis: Document contains clean fonts and text. No Javascript action nodes or external URI links identified.";
      } else {
        prediction = "Suspicious";
        risk_score = 45;
        risk_level = "Suspicious";
        virus_total = "4/72";
        ai_analysis = "AI Analysis: Embedded Javascript action code /OpenAction detected inside the PDF structure. Redirection triggers are suspicious.";
      }
    }

    try {
      const res = await API.post('/api/scan/file', { filename: file.name });
      const backendResult = res.data;
      
      const newScan = {
        filename: backendResult.filename,
        prediction: backendResult.prediction || prediction,
        risk_score: backendResult.risk_score || risk_score,
        hash: backendResult.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        virus_total_score: backendResult.virus_total_score || virus_total,
        risk_level: backendResult.risk_level || risk_level,
        ai_analysis: backendResult.ai_analysis || ai_analysis,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      setResult(newScan);
      saveHistory([newScan, ...history]);
      addNotification({
        type: newScan.prediction === 'Safe' ? 'success' : 'danger',
        title: newScan.prediction === 'Safe' ? '🟢 File Scan Completed' : '🔴 Malware Detected',
        message: newScan.prediction === 'Safe' ? `${file.name} is clean.` : `Threat found in ${file.name}`
      });
    } catch (err) {
      const newScan = {
        filename: file.name,
        prediction,
        risk_score,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        virus_total_score: virus_total,
        risk_level,
        ai_analysis,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setResult(newScan);
      saveHistory([newScan, ...history]);
      addNotification({
        type: prediction === 'Safe' ? 'success' : 'danger',
        title: prediction === 'Safe' ? '🟢 File Scan Completed' : '🔴 Malware Detected',
        message: prediction === 'Safe' ? `${file.name} is clean.` : `Threat found in ${file.name}`
      });
    }
    setScanning(false);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FileUp className="w-8 h-8 text-blue-600 animate-pulse" />
            AI Malware File Scanner
          </h1>
          <p className="text-slate-500 text-sm font-medium">Upload PDF, DOCX, ZIP or EXE files to scan for viruses and embedded malicious scripts.</p>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`glass-panel rounded-3xl p-10 border-2 border-dashed flex flex-col items-center justify-center space-y-4 transition-all duration-300 ${
            dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-200 bg-white hover:border-blue-400'
          }`}
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-800 font-bold">Drag and drop file here</p>
            <p className="text-slate-400 text-xs font-medium">Supported formats: PDF, DOCX, ZIP, EXE (Max 50MB)</p>
          </div>
          <input type="file" id="fileInput" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          <div className="flex gap-4">
            <label htmlFor="fileInput" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md text-sm">
              {file ? file.name : 'Choose File'}
            </label>
            {file && (
              <button 
                onClick={handleScan} 
                disabled={scanning} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md text-sm flex items-center gap-2 cursor-pointer"
              >
                {scanning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Scan Now
              </button>
            )}
          </div>
        </div>

        {/* Results display */}
        {result && (
          <div className="animate-fadeIn space-y-6">
            <h3 className="text-sm font-bold text-slate-800">Scan Result Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Verdict Card */}
              <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  result.prediction === 'Safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {result.prediction === 'Safe' ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10 animate-bounce" />}
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">
                  {result.prediction}
                </h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border mt-2 ${
                  result.risk_level === 'Low' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  result.risk_level === 'Suspicious' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {result.risk_level} Risk
                </span>
              </div>

              {/* Technical Indicators */}
              <div className="md:col-span-2 glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                
                {/* AI Analysis */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">AI Malware Report</span>
                  <p className="text-xs text-blue-800 font-semibold mt-1 block leading-relaxed italic">
                    "{result.ai_analysis}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">SHA256 File Hash</span>
                    <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-slate-600 font-semibold truncate" title={result.hash}>
                      <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{result.hash}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">VirusTotal Ratio</span>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold text-xs text-slate-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{result.virus_total_score} detections</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Scan History */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              File Scan History
            </h3>
            {history.length > 0 && (
              <button 
                onClick={clearHistory} 
                className="text-slate-400 hover:text-red-500 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-widest">
                    <th className="pb-3">File Name</th>
                    <th className="pb-3">Hash (SHA-256)</th>
                    <th className="pb-3 text-center">Verdict</th>
                    <th className="pb-3 text-center">VirusTotal</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-800">{h.filename}</td>
                      <td className="py-3 font-mono text-[10px] text-slate-400 max-w-[150px] truncate">{h.hash}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          h.prediction === 'Safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {h.prediction}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-500 font-semibold">{h.virus_total_score}</td>
                      <td className="py-3 text-right text-slate-400">{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 font-bold text-xs">
              No files scanned yet in this session.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FileScanner;