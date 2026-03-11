import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileModal from './ProfileModal';
import DatePicker from '../ui/DatePicker';

export interface Education {
  id: number;
  institutionName: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  grade: string | null;
}

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  education: Education | null; // null = add mode
  onSave: (data: Omit<Education, 'id'>) => Promise<void>;
}

export default function EducationForm({ isOpen, onClose, education, onSave }: EducationFormProps) {
  const [institutionName, setInstitutionName] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grade, setGrade] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toInputDate = (isoDate: string | null) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  const toISODate = (dateStr: string) => {
    if (!dateStr) return null;
    return `${dateStr}T00:00:00Z`;
  };

  useEffect(() => {
    if (isOpen) {
      if (education) {
        setInstitutionName(education.institutionName);
        setDegree(education.degree);
        setFieldOfStudy(education.fieldOfStudy || '');
        setStartDate(toInputDate(education.startDate));
        setEndDate(toInputDate(education.endDate));
        setGrade(education.grade || '');
      } else {
        setInstitutionName('');
        setDegree('');
        setFieldOfStudy('');
        setStartDate('');
        setEndDate('');
        setGrade('');
      }
      setError('');
    }
  }, [education, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !degree.trim() || !startDate) {
      setError('Institution name, degree, and start date are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        institutionName: institutionName.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim() || null,
        startDate: toISODate(startDate)!,
        endDate: toISODate(endDate),
        grade: grade.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title={education ? 'Edit Education' : 'Add Education'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Institution Name *
          </label>
          <input
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="e.g. MIT, Stanford University"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Degree *
            </label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.Tech, M.Sc"
              maxLength={100}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Field of Study
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Computer Science"
              maxLength={100}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date *
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              required
              placeholder="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
              minDate={startDate || undefined}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Grade / CGPA
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. 9.2 CGPA"
            maxLength={20}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
            {saving ? 'Saving...' : education ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
}
