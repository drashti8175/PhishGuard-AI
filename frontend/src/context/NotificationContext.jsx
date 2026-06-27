import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

let _id = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ type = 'info', title, message }) => {
    const id = ++_id;
    setNotifications(prev => [{ id, type, title, message, visible: true }, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationToasts notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
};

const ICONS = {
  danger:  '🔴',
  warning: '🟡',
  success: '🟢',
  info:    '🔵',
};

const COLORS = {
  danger:  'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  success: 'border-emerald-200 bg-emerald-50',
  info:    'border-blue-200 bg-blue-50',
};

const TEXT_COLORS = {
  danger:  'text-red-800',
  warning: 'text-amber-800',
  success: 'text-emerald-800',
  info:    'text-blue-800',
};

const NotificationToasts = ({ notifications, onDismiss }) => {
  if (!notifications.length) return null;
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm animate-slideIn ${COLORS[n.type] || COLORS.info}`}
        >
          <span className="text-base shrink-0 mt-0.5">{ICONS[n.type] || ICONS.info}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${TEXT_COLORS[n.type] || TEXT_COLORS.info}`}>{n.title}</p>
            {n.message && <p className={`text-[11px] font-medium mt-0.5 ${TEXT_COLORS[n.type] || TEXT_COLORS.info} opacity-80`}>{n.message}</p>}
          </div>
          <button onClick={() => onDismiss(n.id)} className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer text-lg leading-none">&times;</button>
        </div>
      ))}
    </div>
  );
};
