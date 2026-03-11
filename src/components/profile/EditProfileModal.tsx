import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileModal from './ProfileModal';

interface ProfileData {
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  coverPhotoUrl: string | null;
  headLine: string | null;
  about: string | null;
  country: string | null;
  city: string | null;
  followerCount: number;
  followingCount: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onSave: (data: Partial<ProfileData>) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [headLine, setHeadLine] = useState('');
  const [about, setAbout] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile && isOpen) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setHeadLine(profile.headLine || '');
      setAbout(profile.about || '');
      setCountry(profile.country || '');
      setCity(profile.city || '');
      setError('');
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        headLine: headLine.trim() || null,
        about: about.trim() || null,
        country: country.trim() || null,
        city: city.trim() || null,
        profileUrl: profile?.profileUrl || null,
        coverPhotoUrl: profile?.coverPhotoUrl || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Headline
          </label>
          <input
            type="text"
            value={headLine}
            onChange={(e) => setHeadLine(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            maxLength={200}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            About
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={4000}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bangalore"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
}
