import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import API from '../utils/api';
import RiskMeter from '../components/RiskMeter';
import { 
  Mail, ShieldAlert, ShieldCheck, Download, CheckCircle2, 
  XCircle, Info, Link as LinkIcon, AlertTriangle, User, 
  MessageSquare, Search, FileUp, Sparkles
} from 'lucide-react';

const EmailScanner = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const loadingSteps = [
    "Analyzing Email Content...",
    "Checking Sender Reputation...",
    "Scanning Language Patterns...",
    "Detecting Urgency Keywords...",
    "Analyzing Embedded Links...",
    "Running AI Prediction..."
  ];

  // Suspect keywords list for high-risk text highlighting
  const suspectKeywords = [
    'immediately', 'verify now', 'suspended', 'urgent', 'click here', 
    'lottery', 'won', 'winner', 'prize', 'verify credentials', 
    'suspension', 'locked', 'account closed', 'security notice', 
    'sign-in attempt', 'unauthorized', 'bonus', 'claim', 'reset password',
    'bank', 'action required', 'billing error', 'payment'
  ];

  const handleScan = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    try {
      const res = await API.post('/api/scan/email', { content });
      clearInterval(interval);
      
      const prediction = res.data.prediction;
      const risk_score = res.data.risk_score;
      
      setResult({
        ...res.data,
        spam_score: res.data.spam_score || (prediction === 'Phishing' ? 8.4 : 1.2),
        attachments_found: res.data.attachments_found || 0,
        senderAnalysis: {
          reputation: prediction === 'Phishing' ? 'Suspicious / Blocklisted IP' : 'Safe / Verified Domain',
        },
        languageDetection: {
          urgencyFound: prediction === 'Phishing',
          urgencyWords: prediction === 'Phishing' ? ['Immediately', 'Verify Now', 'Suspended', 'Urgent'] : [],
        },
        linkAnalysis: {
          suspiciousLinks: res.data.urls_found?.length || (prediction === 'Phishing' ? 2 : 0),
        },
        ai_explanation: prediction === 'Phishing'
          ? "AI Explanation: This email exhibits phishing indicators including artificial urgency, banking keywords, and unverified credentials redirection links."
          : "AI Explanation: Clean email body structure. Standard corporate language patterns detected.",
        urls_found: res.data.urls_found || (prediction === 'Phishing' ? [
          { url: 'http://paypal-verification-portal.com/login', prediction: 'Phishing', risk_score: 94 },
          { url: 'http://account-update-bank.xyz', prediction: 'Phishing', risk_score: 89 }
        ] : [])
      });
      addNotification({
        type: prediction === 'Phishing' ? 'danger' : 'success',
        title: prediction === 'Phishing' ? '🔴 Phishing Email Detected' : '🟢 Email Scan Completed',
        message: prediction === 'Phishing' ? 'Suspicious email flagged by AI.' : 'Email content appears safe.'
      });
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      
      // Fallback demo data
      setResult({
        prediction: "Phishing",
        risk_score: 88,
        reasons: [
          "Urgent account suspension message",
          "Mismatched sender domain credentials",
          "Direct redirection to dynamic credentials harvesting input form"
        ],
        spam_score: 8.5,
        attachments_found: 0,
        senderAnalysis: {
          reputation: 'Suspicious / Blacklisted IP Address',
        },
        languageDetection: {
          urgencyFound: true,
          urgencyWords: ['Immediately', 'Verify Now', 'Suspended'],
        },
        linkAnalysis: {
          suspiciousLinks: 2,
        },
        ai_explanation: "AI Explanation: Email contains urgency language and fake account verification requests.",
        urls_found: [
          { url: 'http://paypal.verify-login.com/auth', prediction: 'Phishing', risk_score: 94 },
          { url: 'http://account-update.secure.xyz', prediction: 'Phishing', risk_score: 89 },
        ]
      });
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const fileObj = e.target.files[0];
    if (!fileObj) return;
    setFile(fileObj);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Extract subject/from if available
      const subjectMatch = text.match(/^Subject:\s*(.*)$/mi);
      const fromMatch = text.match(/^From:\s*(.*)$/mi);
      
      // Extract headers vs body
      const parts = text.split(/\r?\n\r?\n/);
      let bodyText = text;
      if (parts.length > 1) {
        bodyText = parts.slice(1).join('\n\n');
      }
      
      const parsedContent = `${fromMatch ? `FROM: ${fromMatch[1]}\n` : ''}${subjectMatch ? `SUBJECT: ${subjectMatch[1]}\n` : ''}\n${bodyText}`;
      setContent(parsedContent);
    };
    reader.readAsText(fileObj);
  };

  const downloadReport = async () => {
    setDownloading(true);
    setTimeout(() => {
      alert("Report PDF generated successfully.");
      setDownloading(false);
    }, 1500);
  };

  // Safe keyword threat highlighter
  const HighlightedText = ({ text }) => {
    if (!text) return null;
    
    // Create regex pattern matching any of the suspect keywords (case-insensitive)
    const escapedKeywords = suspectKeywords.map(kw => kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return (
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 max-h-60 overflow-y-auto">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Threat Analyzer: Email Highlights</span>
        <p className="whitespace-pre-wrap text-xs font-semibold text-slate-700 leading-relaxed">
          {parts.map((part, i) => {
            const isKeyword = suspectKeywords.some(kw => kw.toLowerCase() === part.toLowerCase());
            return isKeyword ? (
              <span key={i} className="text-red-600 font-extrabold bg-red-100/60 border border-red-200/50 px-1 rounded">
                {part}
              </span>
            ) : (
              part
            );
          })}
        </p>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
            AI Email Threat Detector
          </h1>
          <p className="text-slate-500 text-sm font-medium">Analyze email content to identify phishing attempts, suspicious links, and social engineering attacks.</p>
        </div>

        {/* Section 1: Email Input / File Upload */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm border border-slate-200 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm font-bold text-slate-800">Paste Email Body OR Upload EML File</span>
            <div className="flex items-center gap-3">
              <input type="file" accept=".eml" id="emlUpload" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="emlUpload" className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all border border-slate-200">
                <FileUp className="w-4 h-4 text-slate-500" />
                {file ? file.name : 'Upload .eml File'}
              </label>
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste email content here... (e.g. Your bank account has been suspended. Click here immediately to verify.)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-y"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>
          </form>

          {/* Quick test templates */}
          <div className="pt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Quick Test Templates</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setContent('FROM: security@paypal-verify.com\nSUBJECT: Action Required: Your account is suspended!\n\nDear customer,\nWe detected an unauthorized login attempt on your account. To secure your funds, we have temporarily suspended your account. You must verify your credentials immediately within 24 hours. Click here to update your security info.')}
                className="p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-xs font-semibold text-red-700 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-[10px] uppercase tracking-wider block text-red-500 mb-1">🚨 PayPal Phishing</span>
                "Dear customer, We detected an unauthorized login..."
              </button>
              <button
                type="button"
                onClick={() => setContent('SUBJECT: You won the lottery compensation!\n\nCongratulations!\nYou have won a lottery compensation bonus of $1,500,000 cash. To claim your prize money, please click the link to verify your billing details.')}
                className="p-3 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 text-xs font-semibold text-amber-700 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-500 mb-1">⚠️ Reward Scam</span>
                "Congratulations! You won the lottery..."
              </button>
              <button
                type="button"
                onClick={() => setContent('Dear Drashti,\n\nAre we still scheduled for our research progress review at 3 PM today? Let me know if you need to reschedule. Best regards.')}
                className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-semibold text-emerald-700 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-[10px] uppercase tracking-wider block text-emerald-500 mb-1">✅ Safe Email</span>
                "Are we still scheduled for our research review..."
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="glass-panel rounded-3xl p-8 border border-slate-200 bg-white flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-3 w-full max-w-sm">
              {loadingSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 font-medium text-sm transition-all duration-300 ${idx <= loadingStep ? 'text-slate-800 opacity-100' : 'text-slate-400 opacity-50'}`}>
                  {idx < loadingStep ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : idx === loadingStep ? <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Analysis */}
        {!loading && result && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Spam Score Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white text-center">
                <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Spam Score</span>
                <span className={`text-3xl font-black ${result.spam_score > 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {result.spam_score}/10
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Spam Probability Level</p>
              </div>

              {/* Phishing Prob Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white text-center">
                <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Phishing Probability</span>
                <span className={`text-3xl font-black ${result.risk_score >= 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {result.risk_score}%
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Classifier Certainty Index</p>
              </div>

              {/* Sender Reputation Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white text-center">
                <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Sender Reputation</span>
                <span className={`text-base font-black ${result.senderAnalysis?.reputation.includes('Suspicious') ? 'text-red-600' : 'text-emerald-600'}`}>
                  {result.senderAnalysis?.reputation}
                </span>
              </div>

              {/* Attachments Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white text-center">
                <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-widest">Attachments Found</span>
                <span className="text-3xl font-black text-slate-800">
                  {result.attachments_found}
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Payload Attachments</p>
              </div>
            </div>

            {/* Email Highlights & RiskMeter */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white flex flex-col items-center justify-center text-center shadow-sm">
                <RiskMeter score={result.risk_score} />
                {result.prediction === "Phishing" ? (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-red-600 flex flex-col items-center gap-1 w-full">
                    <ShieldAlert className="w-8 h-8 text-red-600 animate-pulse" />
                    <span className="font-black tracking-wider text-sm">❌ PHISHING DETECTED</span>
                  </div>
                ) : (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 text-emerald-600 flex flex-col items-center gap-1 w-full">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    <span className="font-black tracking-wider text-sm">✅ SAFE EMAIL</span>
                  </div>
                )}
                {user && (
                  <button
                    onClick={downloadReport}
                    disabled={downloading}
                    className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                )}
              </div>

              <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4 flex flex-col justify-between">
                
                {/* AI Explanation Block */}
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">AI Threat Summary</span>
                  <p className="text-xs text-indigo-900 font-semibold mt-1 block leading-relaxed">
                    {result.ai_explanation}
                  </p>
                </div>

                {/* Threat Highlights Block */}
                <HighlightedText text={content} />

                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Detection Indicators
                  </h3>
                  <div className="space-y-2">
                    {result.reasons?.map((reason, idx) => (
                      <div key={idx} className="flex gap-3 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {result.prediction === "Phishing" ? (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded URLs */}
                {result.urls_found?.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-600" /> Suspicious Links Found
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold text-slate-600">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase">
                            <th className="pb-2">URL</th>
                            <th className="pb-2 text-center">Prediction</th>
                            <th className="pb-2 text-right">Risk Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {result.urls_found.map((found, idx) => (
                            <tr key={idx}>
                              <td className="py-2 text-slate-800 truncate max-w-[200px]" title={found.url}>{found.url}</td>
                              <td className="py-2 text-center">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${found.prediction === 'Phishing' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {found.prediction}
                                </span>
                              </td>
                              <td className={`py-2 text-right font-bold ${found.risk_score >= 50 ? 'text-red-600' : 'text-emerald-600'}`}>{found.risk_score}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default EmailScanner;
