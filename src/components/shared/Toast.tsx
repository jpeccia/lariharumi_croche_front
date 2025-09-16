import React from 'react';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import { CheckCircle, AlertCircle, Info, XCircle, Heart } from 'lucide-react';

interface CustomToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'kawaii';
  title: string;
  message?: string;
  duration?: number;
}

const ToastIcon = ({ type }: { type: CustomToastProps['type'] }) => {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case 'error':
      return <XCircle className={`${iconClass} text-red-500`} />;
    case 'warning':
      return <AlertCircle className={`${iconClass} text-yellow-500`} />;
    case 'info':
      return <Info className={`${iconClass} text-blue-500`} />;
    case 'kawaii':
      return <Heart className={`${iconClass} text-pink-500`} />;
    default:
      return <Info className={`${iconClass} text-gray-500`} />;
  }
};

const ToastContent = ({ type, title, message }: Omit<CustomToastProps, 'duration'>) => (
  <div className="flex items-start space-x-3">
    <ToastIcon type={type} />
    <div className="flex-1">
      <p className="font-semibold text-gray-800 text-sm">{title}</p>
      {message && (
        <p className="text-gray-600 text-xs mt-1">{message}</p>
      )}
    </div>
  </div>
);

export const showToast = ({ type, title, message, duration = 5000 }: CustomToastProps) => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: `custom-toast custom-toast-${type}`,
  };

  toast(<ToastContent type={type} title={title} message={message} />, options);
};

// Funções de conveniência
export const showSuccess = (title: string, message?: string) => 
  showToast({ type: 'success', title, message });

export const showError = (title: string, message?: string) => 
  showToast({ type: 'error', title, message });

export const showWarning = (title: string, message?: string) => 
  showToast({ type: 'warning', title, message });

export const showInfo = (title: string, message?: string) => 
  showToast({ type: 'info', title, message });

export const showKawaii = (title: string, message?: string) => 
  showToast({ type: 'kawaii', title, message });

// Componente de container customizado
export function CustomToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-toast-progress"
      className="custom-toast-container"
    />
  );
}

