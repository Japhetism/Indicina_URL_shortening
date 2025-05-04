import React from 'react';
import { INotification } from '../interfaces';

const typeStyles = {
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
};

const Notification = ({ message, type, onClose }: INotification) => {
  const styles = typeStyles[type];

  return (
    <div className={`flex justify-between items-center px-4 py-2 rounded-md shadow-md ${styles.bg}`}>
      <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 font-bold text-lg"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
