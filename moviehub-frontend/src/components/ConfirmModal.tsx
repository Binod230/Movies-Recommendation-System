/* SUBEDI RABIN M25W0465 */
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-bold uppercase bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;