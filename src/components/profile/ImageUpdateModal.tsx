import React, { useState, useEffect } from 'react';
import { Loader2, User, ImageIcon } from 'lucide-react';
import ProfileModal from './ProfileModal';

interface ImageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'profile' | 'cover';
  currentUrl: string | null;
  onSave: (url: string | null) => Promise<void>;
}

export default function ImageUpdateModal({ isOpen, onClose, type, currentUrl, onSave }: ImageUpdateModalProps) {
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl || '');
      setError('');
    }
  }, [isOpen, currentUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(url.trim() || null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    } finally {
      setSaving(false);
    }
  };

  const title = type === 'profile' ? 'Update Profile Photo' : 'Update Cover Photo';

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Preview */}
        <div className="flex justify-center">
          {type === 'profile' ? (
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
              {url ? (
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-2 border-slate-300 dark:border-slate-600">
              {url ? (
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <ImageIcon className="w-10 h-10 text-white/60" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Paste ${type === 'profile' ? 'profile' : 'cover'} photo URL...`}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Enter a direct link to an image (JPG, PNG, WebP)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving || !currentUrl}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Remove photo
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </ProfileModal>
  );
}
