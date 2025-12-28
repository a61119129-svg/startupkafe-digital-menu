import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../store/store';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };
  
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };
  
  return (
    <div
      className={`${isExiting ? 'toast-exit' : 'toast-enter'} 
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg bg-white min-w-[280px] max-w-sm
        ${bgColors[toast.type] || bgColors.success}`}
    >
      {icons[toast.type] || icons.success}
      <p className="flex-1 text-sm font-medium text-dark-100">{toast.message}</p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-dark-100/60" />
      </button>
    </div>
  );
}
