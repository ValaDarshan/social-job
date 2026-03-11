import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileModal from './ProfileModal';
import DatePicker from '../ui/DatePicker';

export interface Certificate {
  id: number;
  name: string;
  issueBy: string;
  issueDate: string;
  url: string | null;
  description: string | null;
}

interface CertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null; // null = add mode
  onSave: (data: Omit<Certificate, 'id'>) => Promise<void>;
}

export default function CertificateForm({ isOpen, onClose, certificate, onSave }: CertificateFormProps) {
  const [name, setName] = useState('');
  const [issueBy, setIssueBy] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toInputDate = (isoDate: string | null) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  const toISODate = (dateStr: string) => {
    if (!dateStr) return '';
    return `${dateStr}T00:00:00Z`;
  };

  useEffect(() => {
    if (isOpen) {
      if (certificate) {
        setName(certificate.name);
        setIssueBy(certificate.issueBy);
        setIssueDate(toInputDate(certificate.issueDate));
        setUrl(certificate.url || '');
        setDescription(certificate.description || '');
      } else {
        setName('');
        setIssueBy('');
        setIssueDate('');
        setUrl('');
        setDescription('');
      }
      setError('');
    }
  }, [certificate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issueBy.trim() || !issueDate) {
      setError('Name, issuing organization, and issue date are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        name: name.trim(),
        issueBy: issueBy.trim(),
        issueDate: toISODate(issueDate),
        url: url.trim() || null,
        description: description.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title={certificate ? 'Edit Certificate' : 'Add Certificate'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Certificate Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AWS Solutions Architect"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Issued By *
          </label>
          <input
            type="text"
            value={issueBy}
            onChange={(e) => setIssueBy(e.target.value)}
            placeholder="e.g. Amazon Web Services"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Issue Date *
          </label>
          <DatePicker
            value={issueDate}
            onChange={setIssueDate}
            required
            placeholder="Select issue date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Credential URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://verify.example.com/cert/..."
            maxLength={500}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the certification..."
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
            {saving ? 'Saving...' : certificate ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
}
