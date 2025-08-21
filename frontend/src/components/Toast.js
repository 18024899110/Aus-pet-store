import React, { useState } from 'react';
import { Toast as BSToast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Toast context
export const ToastContext = React.createContext();

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'danger', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer 
        position="top-end" 
        className="p-3"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
          top: '20px',
          right: '20px'
        }}
      >
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Individual Toast notification component
const ToastNotification = ({ toast, onClose }) => {
  const [show, setShow] = useState(true);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle className="text-success me-2" />;
      case 'danger':
        return <FaTimes className="text-danger me-2" />;
      case 'warning':
        return <FaExclamationTriangle className="text-warning me-2" />;
      default:
        return <FaInfoCircle className="text-info me-2" />;
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <BSToast
      show={show}
      onClose={handleClose}
      className={`border-${toast.type}`}
    >
      <BSToast.Header>
        {getIcon()}
        <strong className="me-auto">
          {toast.type === 'success' && 'Success'}
          {toast.type === 'danger' && 'Error'}
          {toast.type === 'warning' && 'Warning'}
          {toast.type === 'info' && 'Info'}
        </strong>
      </BSToast.Header>
      <BSToast.Body>{toast.message}</BSToast.Body>
    </BSToast>
  );
};

// Hook for using toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Simple Toast object for direct use
export const ToastHelper = {
  success: (message) => {
    // This is a simple implementation that could work outside of context
    console.log('Success:', message);
    alert(`Success: ${message}`);
  },
  error: (message) => {
    console.log('Error:', message);
    alert(`Error: ${message}`);
  },
  warning: (message) => {
    console.log('Warning:', message);
    alert(`Warning: ${message}`);
  },
  info: (message) => {
    console.log('Info:', message);
    alert(`Info: ${message}`);
  }
};

// Alias for backward compatibility
export { ToastHelper as Toast };