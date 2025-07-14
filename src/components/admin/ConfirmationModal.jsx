import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, type = 'danger' }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-background-900 to-background-950 rounded-2xl max-w-md w-full shadow-2xl border border-background-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`relative p-4 rounded-xl ${
              type === 'danger' ? 'bg-gradient-to-br from-red-500/20 to-red-600/20' : 'bg-gradient-to-br from-yellow-500/20 to-amber-600/20'
            }`}>
              <div className={`absolute inset-0 rounded-xl blur-xl ${
                type === 'danger' ? 'bg-red-500/30' : 'bg-yellow-500/30'
              }`} />
              <AlertTriangle className={`h-6 w-6 relative z-10 ${
                type === 'danger' ? 'text-red-400' : 'text-yellow-400'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button
              onClick={onConfirm}
              className={`group relative flex-1 px-5 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 overflow-hidden ${
                type === 'danger'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/25 hover:shadow-red-500/40'
                  : 'bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white shadow-yellow-500/25 hover:shadow-yellow-500/40'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Confirm</span>
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3 bg-background-800/80 hover:bg-background-700 border border-background-700 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;