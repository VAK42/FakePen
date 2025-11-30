import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}
export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex  items-center gap-3 max-w-md`}>
        <p className="flex-1">{message}</p>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="hover:bg-white/20 rounded p-1 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  );
  return { showToast, ToastContainer };
}