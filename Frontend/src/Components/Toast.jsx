import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

let _show = null;

// Call this anywhere: showToast('Course added successfully!', 'ok')
export function showToast(message, type = 'ok', duration = 4000) {
  if (_show) _show(message, type, duration);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _show = (message, type, duration) => {
      const id = Date.now();
      setToasts(t => [...t, { id, message, type }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    };
    return () => { _show = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.type === 'ok'
            ? <CheckCircle size={16} />
            : <XCircle size={16} />}
          <span>{t.message}</span>
          <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
