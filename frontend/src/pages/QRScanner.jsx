import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import RiskMeter from '../components/RiskMeter';
import { QrCode, Upload, FileText, CheckCircle2, XCircle, Download, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

const QRScanner = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    
    // Standard Multi-part Form Data upload handling
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/api/scan/qr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "QR scan upload failed. Is the server online?");
    }
    setLoading(false);
  };

  const downloadReport = async () => {
    if (!result?.id) return;
    setDownloading(true);
    try {
      const response = await API.get(`/api/report/download/${result.id}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `phishguard_qr_report_${result.id}.pdf`;
      link.click();
      window.URL.createObjectURL(blob);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF report.");
    }
    setDownloading(false);
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Scanner Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI QR Code Link Scanner</h1>
            <p className="text-slate-500 text-sm font-medium">Upload suspicious QR code snapshots to decode and inspect embedded target URLs before visiting them on your mobile phone.</p>
          </div>

          {/* Dropzone Panel */}
          <div className="glass-panel rounded-3xl p-6 shadow-md border border-slate-200 bg-white">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 hover:border-cyber-primary/45 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative group bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="w-12 h-12 bg-cyber-primary/10 rounded-2xl flex items-center justify-center border border-cyber-primary/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-cyber-primary" />
                </div>
                
                <span className="text-sm font-bold text-slate-800 mb-1">
                  {file ? file.name : "Drag & Drop QR Image"}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Supports standard formats: PNG, JPG, JPEG (Max 5MB)
                </span>
              </div>

              {file && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyber-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Decoding Matrix & Running AI Checks...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      <span>Upload & Decrypt QR Link</span>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Scan Results Output */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              {/* Risk Meter Gauge Panel */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white flex flex-col items-center justify-center text-center h-fit">
                <RiskMeter score={result.risk_score} />
                
                {result.prediction === "Phishing" ? (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 text-cyber-danger flex items-center gap-2 font-bold text-xs tracking-wider">
                    <ShieldAlert className="w-5 h-5 animate-pulse text-red-600" />
                    <span>MALICIOUS QR DETECTED</span>
                  </div>
                ) : (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 text-cyber-secondary flex items-center gap-2 font-bold text-xs tracking-wider">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>SAFE PAYLOAD</span>
                  </div>
                )}

                {user ? (
                  <button
                    onClick={downloadReport}
                    disabled={downloading}
                    className="mt-6 w-full bg-slate-50 hover:bg-cyber-primary/10 hover:text-cyber-primary border border-slate-200 hover:border-cyber-primary/30 text-slate-700 font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    {downloading ? (
                      <div className="w-4 h-4 border-2 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Export Threat PDF Report</span>
                  </button>
                ) : (
                  <p className="text-[10px] text-slate-400 font-semibold mt-4 leading-relaxed max-w-[200px] mx-auto italic">
                    Sign in to register scans and export comprehensive PDF digests.
                  </p>
                )}
              </div>

              {/* Analysis details Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Decoded Content Text */}
                <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyber-primary" />
                    <span>Decoded Text Payload</span>
                  </h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 font-mono text-sm text-cyber-primary break-all">
                    {result.decoded_text}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {result.is_url ? (
                      <span className="text-cyber-primary">✓ Target recognized as URL link. Automatically routing payload through the URL Deep ML Engine.</span>
                    ) : (
                      <span className="text-slate-500">Payload represents standard static text string. No embedded URL link identified.</span>
                    )}
                  </div>
                </div>

                {/* Explanations (If URL is decoded) */}
                {result.is_url && result.url_analysis && (
                  <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Info className="w-5 h-5 text-cyber-primary" />
                      <span>Dynamic Link Analysis</span>
                    </h3>
                    <div className="space-y-3">
                      {result.url_analysis.reasons.map((reason, idx) => (
                        <div key={idx} className="flex gap-3 text-sm font-semibold text-slate-600 leading-relaxed">
                          {result.prediction === "Phishing" ? (
                            <XCircle className="w-5 h-5 text-cyber-danger shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-cyber-secondary shrink-0 mt-0.5" />
                          )}
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Help Section */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyber-primary" />
              <span>Helper Guide</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              QR code phishing (also known as <strong>Quishing</strong>) hides malicious web links inside scannable images. Threat actors place these on flyers, parking meters, or emails to bypass email filters.
            </p>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">How to test this module:</span>
              <ul className="space-y-2 text-xs text-slate-500 list-disc list-inside">
                <li>Generate a QR code using any online generator containing a test URL.</li>
                <li>Save the QR code as an image (PNG or JPG).</li>
                <li>Drag and drop the image into the scanner above.</li>
                <li>Click <strong>Upload & Decrypt</strong> to view the risk classification.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRScanner;
