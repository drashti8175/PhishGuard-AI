import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Core Application Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import URLScanner from './pages/URLScanner';
import EmailScanner from './pages/EmailScanner';
import QRScanner from './pages/QRScanner';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/History';
import FileScanner from './pages/FileScanner';
import ThreatIntel from './pages/ThreatIntel';
import Reports from './pages/Reports';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import AIChat from './pages/AIChat';
import SecurityScore from './pages/SecurityScore';

import './App.css';

// Higher-order layout wrapper separating dashboard consoles from auth pages
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="/home" element={null} />
          <Route path="/" element={null} />
          <Route path="/*" element={<Sidebar />} />
        </Routes>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Entry Scanners */}
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<URLScanner />} />
            <Route path="/email-scanner" element={<EmailScanner />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            
            {/* SecOps Authentication Gates */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Metrics Dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/file-scanner"
              element={
                <ProtectedRoute>
                  <FileScanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/threat-intel"
              element={
                <ProtectedRoute>
                  <ThreatIntel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security-score"
              element={
                <ProtectedRoute>
                  <SecurityScore />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
