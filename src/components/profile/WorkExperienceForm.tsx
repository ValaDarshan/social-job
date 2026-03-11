import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileModal from './ProfileModal';
import DatePicker from '../ui/DatePicker';

export interface WorkExperience {
  id: number;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  location: string | null;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP';
}

interface WorkExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  experience: WorkExperience | null; // null = add mode
  onSave: (data: Omit<WorkExperience, 'id'>) => Promise<void>;
}

export default function WorkExperienceForm({ isOpen, onClose, experience, onSave }: WorkExperienceFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<WorkExperience['employmentType']>('FULL_TIME');
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
      if (experience) {
        setCompanyName(experience.companyName);
        setJobTitle(experience.jobTitle);
        setStartDate(toInputDate(experience.startDate));
        setEndDate(toInputDate(experience.endDate));
        setDescription(experience.description || '');
        setLocation(experience.location || '');
        setEmploymentType(experience.employmentType);
      } else {
        setCompanyName('');
        setJobTitle('');
        setStartDate('');
        setEndDate('');
        setDescription('');
        setLocation('');
        setEmploymentType('FULL_TIME');
      }
      setError('');
    }
  }, [experience, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim() || !startDate) {
      setError('Company name, job title, and start date are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        startDate: toISODate(startDate)!,
        endDate: toISODate(endDate),
        description: description.trim() || null,
        location: location.trim() || null,
        employmentType,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save work experience');
    } finally {
      setSaving(false);
    }
  };

  const employmentTypeLabels: Record<WorkExperience['employmentType'], string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    TEMPORARY: 'Temporary',
    INTERNSHIP: 'Internship',
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title={experience ? 'Edit Experience' : 'Add Experience'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            maxLength={100}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Employment Type *
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as WorkExperience['employmentType'])}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {Object.entries(employmentTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bangalore, India"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
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
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
            maxLength={2000}
            rows={4}
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
            {saving ? 'Saving...' : experience ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
}
