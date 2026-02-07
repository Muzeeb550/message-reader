'use client';

interface ClearMessagesModalProps {
  isOpen: boolean;
  messageCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearMessagesModal({ 
  isOpen, 
  messageCount, 
  onConfirm, 
  onCancel 
}: ClearMessagesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[#1f2c34] rounded-2xl mx-4 w-full max-w-sm shadow-2xl animate-slideUp">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">Clear All Messages?</h2>
        </div>
        
        {/* Modal Content */}
        <div className="px-6 py-4">
          <p className="text-gray-300 text-sm">
            This will permanently delete all {messageCount} message{messageCount !== 1 ? 's' : ''} from your device. This action cannot be undone.
          </p>
        </div>
        
        {/* Modal Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="touch-manipulation flex-1 bg-[#2a3942] text-white py-3 px-4 rounded-xl font-medium active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="touch-manipulation flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium active:scale-95 transition-transform"
          >
            Clear All
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
