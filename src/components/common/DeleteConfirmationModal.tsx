import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName: string;
  itemType?: string;
  warningText?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Permanent Deletion',
  itemName,
  itemType = 'item',
  warningText = 'This action cannot be undone. All associated data will be permanently removed from Dala Kitchen records.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#e6e2dc] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-[#1b1c1c] leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              You are about to delete the following {itemType}:
            </p>
          </div>
        </div>

        {/* Item Target Display Box */}
        <div className="bg-[#fcf9f6] border border-[#e6e2dc] rounded-xl p-3.5 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
            Target {itemType}
          </span>
          <p className="font-bold text-sm text-[#1b1c1c] break-words">
            "{itemName}"
          </p>
        </div>

        <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 mb-6 font-medium leading-relaxed">
          ⚠️ {warningText}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#d8d3cb] text-xs font-bold text-[#1b1c1c] rounded-xl hover:bg-[#f8f6f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={15} /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};
