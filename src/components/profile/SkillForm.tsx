import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileModal from './ProfileModal';

export interface Skill {
  id: number;
  skillName: string;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  skillExperience: number;
}

interface SkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null; // null = add mode
  onSave: (data: Omit<Skill, 'id'>) => Promise<void>;
}

export default function SkillForm({ isOpen, onClose, skill, onSave }: SkillFormProps) {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<Skill['skillLevel']>('BEGINNER');
  const [skillExperience, setSkillExperience] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (skill) {
        setSkillName(skill.skillName);
        setSkillLevel(skill.skillLevel);
        setSkillExperience(skill.skillExperience);
      } else {
        setSkillName('');
        setSkillLevel('BEGINNER');
        setSkillExperience(0);
      }
      setError('');
    }
  }, [skill, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError('Skill name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        skillName: skillName.trim(),
        skillLevel,
        skillExperience,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title={skill ? 'Edit Skill' : 'Add Skill'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Skill Name *
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g. React, Java, Python"
            maxLength={100}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Skill Level *
          </label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as Skill['skillLevel'])}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            value={skillExperience}
            onChange={(e) => setSkillExperience(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
            min={0}
            max={50}
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
            {saving ? 'Saving...' : skill ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
}
