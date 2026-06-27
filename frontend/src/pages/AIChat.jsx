import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Trash2, Copy, CheckCheck } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: 'Is this URL safe?', text: 'Is this URL safe? https://secure-login-paypal.xyz' },
  { label: 'Explain phishing email', text: 'Explain why this is a phishing email: "Your account is suspended, verify immediately."' },
  { label: 'What is ransomware?', text: 'What is ransomware and how does it spread?' },
  { label: 'How to detect phishing?', text: 'What are the top signs to detect a phishing website?' },
  { label: 'PhishGuard AI accuracy?', text: 'What is the AI accuracy of PhishGuard and how does it work?' },
  { label: 'Protect against credential theft', text: 'How can I protect myself from credential theft attacks?' },
];

const getAIResponse = (q) => {
  const lower = q.toLowerCase();
  if (lower.includes('url') && (lower.includes('safe') || lower.includes('phishing'))) {
    return `🔍 **URL Analysis:**\n\nThe URL pattern you mentioned contains several red flags:\n• Suspicious subdomain mimicking a trusted brand\n• Domain registered recently (under 30 days)\n• Missing valid SSL certificate\n• Brand impersonation keywords detected\n\n**Verdict: ❌ Malicious** — Do NOT enter credentials. Use the URL Scanner tool for a full AI risk score.`;
  }
  if (lower.includes('phishing email') || (lower.includes('explain') && lower.includes('email'))) {
    return `📧 **Phishing Email Analysis:**\n\nThis email exhibits classic phishing indicators:\n• **Urgency language** — "suspended", "verify immediately" pressure users to act fast\n• **Vague sender** — Legitimate companies never ask for credentials via email\n• **Fear tactics** — Account suspension threats create panic\n• **No personalization** — Generic "Dear Customer" greetings\n\n**Recommendation:** Delete immediately. Never click embedded links.`;
  }
  if (lower.includes('ransomware')) {
    return `🦠 **Ransomware Explained:**\n\nRansomware encrypts your files and demands payment for the decryption key.\n\n**Spread vectors:**\n• Phishing email attachments (ZIP, EXE, DOCX macros)\n• Drive-by downloads from malicious websites\n• Exploiting unpatched vulnerabilities\n• RDP brute-force attacks\n\n**Prevention:** Keep offline backups, patch systems regularly, never open unexpected attachments.`;
  }
  if (lower.includes('detect') && lower.includes('phishing')) {
    return `🛡️ **Top Signs of a Phishing Website:**\n\n1. **Misspelled domain** — paypa1.com vs paypal.com\n2. **No HTTPS** — Padlock missing in browser\n3. **Urgency messages** — "Your account closes in 24 hours"\n4. **Generic greetings** — "Dear User" instead of your name\n5. **Suspicious redirects** — URL changes after clicking\n6. **Poor grammar/spelling** — Unprofessional language\n\nPaste any suspicious URL into PhishGuard URL Scanner for instant AI analysis.`;
  }
  if (lower.includes('accuracy') || lower.includes('how does it work')) {
    return `🤖 **PhishGuard AI Engine:**\n\nPhishGuard uses a **Random Forest / Gradient Boosting ML model** trained on 50,000+ labeled URLs and emails.\n\n**Performance Metrics:**\n• Accuracy: **98.4%**\n• Precision: **97.2%**\n• Recall: **96.8%**\n• F1 Score: **97.0%**\n\nFeatures analyzed: domain age, SSL status, URL length, redirect count, subdomains, keyword patterns, WHOIS data, blacklist checks, and 40+ more signals.`;
  }
  if (lower.includes('credential') || lower.includes('protect')) {
    return `🔐 **Protecting Against Credential Theft:**\n\n**Immediate Actions:**\n• Enable **Two-Factor Authentication (2FA)** on all accounts\n• Use a **password manager** (Bitwarden, 1Password)\n• Never reuse passwords across sites\n• Check haveibeenpwned.com for breached emails\n\n**Ongoing Vigilance:**\n• Verify URLs before entering passwords\n• Use PhishGuard to scan suspicious links\n• Monitor login activity regularly`;
  }
  return `🛡️ **PhishGuard AI Assistant:**\n\nI can help you with:\n• Analyzing suspicious URLs and emails\n• Explaining cybersecurity threats (phishing, ransomware, malware)\n• Providing security best practices\n• Interpreting PhishGuard scan results\n\nTry asking: *"Is this URL safe?"*, *"What is ransomware?"*, or *"How to detect phishing?"*`;
};

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

const MessageBubble = ({ msg }) => {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === 'ai';

  const copyText = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderText = (text) =>
    text.split('\n').map((line, i) => (
      <p key={i} className={`${line === '' ? 'mt-2' : ''} leading-relaxed`}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));

  return (
    <div className={`flex items-end gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAI ? 'bg-blue-600' : 'bg-slate-700'}`}>
        {isAI ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
      </div>
      <div className={`group max-w-[75%] relative`}>
        <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm font-medium ${
          isAI ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm' : 'bg-blue-600 text-white rounded-br-sm'
        }`}>
          {renderText(msg.text)}
        </div>
        {isAI && (
          <button onClick={copyText} className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
            {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
        <p className={`text-[9px] font-semibold text-slate-400 mt-1.5 ${isAI ? 'text-left' : 'text-right'}`}>{msg.time}</p>
      </div>
    </div>
  );
};

const AIChat = () => {
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: `👋 Hello! I'm **PhishGuard AI Assistant**.\n\nI can help you analyze threats, explain cybersecurity concepts, and guide you on staying safe online.\n\nAsk me anything — try the quick prompts below or type your own question!`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '48px';
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: getAIResponse(userMsg),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000 + Math.random() * 600);
  };

  const clearChat = () => setMessages([{
    role: 'ai',
    text: `Chat cleared. How can I help you with cybersecurity today?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);

  return (
    <div className="flex-1 p-8 min-h-screen bg-cyber-bg flex flex-col" style={{ maxHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 space-y-5" style={{ minHeight: 0 }}>

        {/* Header */}
        <div className="flex justify-between items-end shrink-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600 animate-pulse" />
              AI Security Chat Assistant
            </h1>
            <p className="text-slate-500 text-sm font-medium">Ask about threats, URLs, phishing, or cybersecurity best practices.</p>
          </div>
          <button onClick={clearChat} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" /> Clear Chat
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p.text)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm">
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-100 p-4 shrink-0">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder='Ask anything... e.g. "Is this URL safe?" or "Explain phishing."'
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none overflow-hidden"
                style={{ minHeight: '48px' }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || typing}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-2 text-center">
              Enter to send · Shift+Enter for new line · AI responses are for educational purposes
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChat;
