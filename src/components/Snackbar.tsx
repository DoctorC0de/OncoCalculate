import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface SnackbarMessage {
  id: string;
  text: string;
  type?: 'success' | 'warning' | 'info';
}

interface SnackbarProps {
  message: SnackbarMessage | null;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-slate-800/95 text-slate-100 border border-slate-700/80 shadow-2xl backdrop-blur-md animate-slide-up max-w-[90vw]">
      {getIcon()}
      <span className="text-[13px] font-medium tracking-tight text-white">{message.text}</span>
      <button
        onClick={onClose}
        className="ml-1 p-0.5 text-slate-400 hover:text-white rounded-full"
        aria-label="关闭提示"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
