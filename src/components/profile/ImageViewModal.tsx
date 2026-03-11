import { useEffect } from 'react';
import { X, User, ImageIcon } from 'lucide-react';

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  type: 'profile' | 'cover';
}

export default function ImageViewModal({ isOpen, onClose, imageUrl, type }: ImageViewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image */}
      <div className="relative z-10 max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={type === 'profile' ? 'Profile photo' : 'Cover photo'}
            className={`max-w-full max-h-[85vh] object-contain ${
              type === 'profile' ? 'rounded-full shadow-2xl' : 'rounded-2xl shadow-2xl'
            }`}
          />
        ) : (
          <div className={`flex flex-col items-center justify-center bg-slate-800 ${
            type === 'profile'
              ? 'w-72 h-72 rounded-full'
              : 'w-[70vw] h-64 rounded-2xl'
          }`}>
            {type === 'profile' ? (
              <User className="w-20 h-20 text-slate-500" />
            ) : (
              <ImageIcon className="w-20 h-20 text-slate-500" />
            )}
            <p className="text-slate-400 text-sm mt-3">No {type} photo set</p>
          </div>
        )}
      </div>
    </div>
  );
}
