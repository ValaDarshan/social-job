import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin, Plus, Trash2, Pencil, Loader2, AlertTriangle, Camera,
  Wrench, GraduationCap, Award, Briefcase, User, ExternalLink, Settings,
  Eye, Upload, UserPlus, UserCheck, UserMinus, Clock,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useAuth } from '../contexts/AuthContext';
import { apiService, handleApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';
import EditProfileModal from '../components/profile/EditProfileModal';
import SkillForm, { type Skill } from '../components/profile/SkillForm';
import EducationForm, { type Education } from '../components/profile/EducationForm';
import CertificateForm, { type Certificate } from '../components/profile/CertificateForm';
import WorkExperienceForm, { type WorkExperience } from '../components/profile/WorkExperienceForm';
import ImageViewModal from '../components/profile/ImageViewModal';
import ImageUpdateModal from '../components/profile/ImageUpdateModal';
import FollowListModal, { type FollowListType } from '../components/profile/FollowListModal';

// ── Types ───────────────────────────────────────────────────────────────────
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

type TabKey = 'skills' | 'education' | 'certificates' | 'experience';

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (iso: string | null) => {
  if (!iso) return 'Present';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const skillLevelBadge = (level: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    BEGINNER:     { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' },
    INTERMEDIATE: { bg: 'bg-blue-100 dark:bg-blue-500/20',      text: 'text-blue-700 dark:text-blue-400' },
    ADVANCED:     { bg: 'bg-purple-100 dark:bg-purple-500/20',  text: 'text-purple-700 dark:text-purple-400' },
  };
  const style = map[level] || map.BEGINNER;
  return `${style.bg} ${style.text}`;
};

const employmentLabel: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
  INTERNSHIP: 'Internship',
};

// ═══════════════════════════════════════════════════════════════════════════
export default function Profile() {
  const { userId: routeUserId } = useParams<{ userId?: string }>();
  const { currentUser } = useAuth();
  // Use URL param if present, otherwise fall back to logged-in user's ID
  const effectiveUserId = routeUserId || currentUser?.userId || '';
  const isOwnProfile = !routeUserId; // If no userId in URL, it's the logged-in user's profile

  // ── State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('skills');

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Image popup / modal states
  const [imagePopup, setImagePopup] = useState<{ type: 'profile' | 'cover'; x: number; y: number } | null>(null);
  const [imageViewOpen, setImageViewOpen] = useState<{ type: 'profile' | 'cover' } | null>(null);
  const [imageUpdateOpen, setImageUpdateOpen] = useState<{ type: 'profile' | 'cover' } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Follow list modal
  const [followListOpen, setFollowListOpen] = useState<FollowListType | null>(null);

  // Connection status (for other users' profiles)
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      const url = API_ENDPOINTS.PROFILE.BY_USER_ID(effectiveUserId);
      const res = await apiService.fetchWithAuth(url);
      const result = await handleApiResponse<ProfileData>(res, 'Failed to load profile');
      setProfile(result.data);
    } catch (err: any) {
      // Profile might not exist yet — that's fine
      if (!err.message?.includes('not found')) {
        setError(err.message || 'Failed to load profile');
      }
    }
  }, [effectiveUserId]);

  const fetchSkills = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      const url = API_ENDPOINTS.PROFILE.SKILLS_BY_USER_ID(effectiveUserId);
      const res = await apiService.fetchWithAuth(url);
      const result = await handleApiResponse<Skill[]>(res, 'Failed to load skills');
      setSkills(result.data || []);
    } catch { /* empty */ }
  }, [effectiveUserId]);

  const fetchEducations = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      const url = API_ENDPOINTS.PROFILE.EDUCATION_BY_USER_ID(effectiveUserId);
      const res = await apiService.fetchWithAuth(url);
      const result = await handleApiResponse<Education[]>(res, 'Failed to load education');
      setEducations(result.data || []);
    } catch { /* empty */ }
  }, [effectiveUserId]);

  const fetchCertificates = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      const url = API_ENDPOINTS.PROFILE.CERTIFICATES_BY_USER_ID(effectiveUserId);
      const res = await apiService.fetchWithAuth(url);
      const result = await handleApiResponse<Certificate[]>(res, 'Failed to load certificates');
      setCertificates(result.data || []);
    } catch { /* empty */ }
  }, [effectiveUserId]);

  const fetchExperiences = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      const url = API_ENDPOINTS.PROFILE.WORK_EXPERIENCE_BY_USER_ID(effectiveUserId);
      const res = await apiService.fetchWithAuth(url);
      const result = await handleApiResponse<WorkExperience[]>(res, 'Failed to load experience');
      setExperiences(result.data || []);
    } catch { /* empty */ }
  }, [effectiveUserId]);

  // Fetch connection status when viewing another user's profile
  const fetchConnectionStatus = useCallback(async () => {
    if (isOwnProfile || !effectiveUserId) return;
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.STATUS(effectiveUserId));
      const result = await handleApiResponse(res, 'Failed to load connection status');
      // result.data could be a string directly or an object with a status field
      const status = typeof result.data === 'string' ? result.data : result.data?.status || result.data?.connectionStatus || 'NONE';
      setConnectionStatus(status);
    } catch {
      setConnectionStatus('NONE');
    }
  }, [isOwnProfile, effectiveUserId]);

  useEffect(() => {
    // Reset state when navigating to a different profile
    setProfile(null);
    setSkills([]);
    setEducations([]);
    setCertificates([]);
    setExperiences([]);
    setError('');
    setConnectionStatus(null);

    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchSkills(), fetchEducations(), fetchCertificates(), fetchExperiences(), fetchConnectionStatus()]);
      setLoading(false);
    };
    load();
  }, [fetchProfile, fetchSkills, fetchEducations, fetchCertificates, fetchExperiences, fetchConnectionStatus]);

  // ── Connection actions ──────────────────────────────────────────────────
  const handleFollowRequest = async () => {
    if (!effectiveUserId) return;
    setConnectionLoading(true);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.REQUEST(effectiveUserId), {
        method: 'POST',
      });
      await handleApiResponse(res, 'Failed to send follow request');
      setConnectionStatus('PENDING');
      fetchProfile(); // Refresh counts
    } catch (err: any) {
      setError(err.message || 'Failed to send follow request');
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!effectiveUserId) return;
    setConnectionLoading(true);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.UNFOLLOW(effectiveUserId), {
        method: 'DELETE',
      });
      await handleApiResponse(res, 'Failed to unfollow');
      setConnectionStatus('NONE');
      fetchProfile(); // Refresh counts
    } catch (err: any) {
      setError(err.message || 'Failed to unfollow');
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!effectiveUserId) return;
    setConnectionLoading(true);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.UNFOLLOW(effectiveUserId), {
        method: 'DELETE',
      });
      await handleApiResponse(res, 'Failed to cancel request');
      setConnectionStatus('NONE');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel request');
    } finally {
      setConnectionLoading(false);
    }
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────
  const handleSaveProfile = async (data: Partial<ProfileData>) => {
    const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.BY_USER_ID(effectiveUserId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleApiResponse<ProfileData>(res, 'Failed to update profile');
    setProfile(result.data);
  };

  // Skills CRUD
  const handleSaveSkill = async (data: Omit<Skill, 'id'>) => {
    if (editingSkill) {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.SKILL_BY_ID(editingSkill.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to update skill');
    } else {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.SKILLS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to add skill');
    }
    await fetchSkills();
  };

  const handleDeleteSkill = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.SKILL_BY_ID(id), { method: 'DELETE' });
      await handleApiResponse(res, 'Failed to delete skill');
      await fetchSkills();
    } finally {
      setDeletingId(null);
    }
  };

  // Education CRUD
  const handleSaveEducation = async (data: Omit<Education, 'id'>) => {
    if (editingEdu) {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.EDUCATION_BY_ID(editingEdu.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to update education');
    } else {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.EDUCATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to add education');
    }
    await fetchEducations();
  };

  const handleDeleteEducation = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.EDUCATION_BY_ID(id), { method: 'DELETE' });
      await handleApiResponse(res, 'Failed to delete education');
      await fetchEducations();
    } finally {
      setDeletingId(null);
    }
  };

  // Certificate CRUD
  const handleSaveCertificate = async (data: Omit<Certificate, 'id'>) => {
    if (editingCert) {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.CERTIFICATE_BY_ID(editingCert.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to update certificate');
    } else {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.CERTIFICATES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to add certificate');
    }
    await fetchCertificates();
  };

  const handleDeleteCertificate = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.CERTIFICATE_BY_ID(id), { method: 'DELETE' });
      await handleApiResponse(res, 'Failed to delete certificate');
      await fetchCertificates();
    } finally {
      setDeletingId(null);
    }
  };

  // Work Experience CRUD
  const handleSaveExperience = async (data: Omit<WorkExperience, 'id'>) => {
    if (editingExp) {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.WORK_EXPERIENCE_BY_ID(editingExp.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to update experience');
    } else {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.WORK_EXPERIENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await handleApiResponse(res, 'Failed to add experience');
    }
    await fetchExperiences();
  };

  const handleDeleteExperience = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.WORK_EXPERIENCE_BY_ID(id), { method: 'DELETE' });
      await handleApiResponse(res, 'Failed to delete experience');
      await fetchExperiences();
    } finally {
      setDeletingId(null);
    }
  };

  // ── Image popup close on outside click ──────────────────────────────
  useEffect(() => {
    if (!imagePopup) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setImagePopup(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [imagePopup]);

  const handleImageClick = (e: React.MouseEvent, type: 'profile' | 'cover') => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setImagePopup({
      type,
      x: type === 'cover' ? rect.left + rect.width / 2 : rect.left + rect.width / 2,
      y: type === 'cover' ? rect.bottom : rect.bottom,
    });
  };

  const handleImageSave = async (type: 'profile' | 'cover', url: string | null) => {
    if (!profile) return;
    const data = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      headLine: profile.headLine,
      about: profile.about,
      country: profile.country,
      city: profile.city,
      profileUrl: type === 'profile' ? url : profile.profileUrl,
      coverPhotoUrl: type === 'cover' ? url : profile.coverPhotoUrl,
    };
    const res = await apiService.fetchWithAuth(API_ENDPOINTS.PROFILE.BY_USER_ID(effectiveUserId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleApiResponse<ProfileData>(res, 'Failed to update image');
    setProfile(result.data);
  };

  // ── Tab config ─────────────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'skills',       label: 'Skills',       icon: <Wrench className="w-4 h-4" />,       count: skills.length },
    { key: 'education',    label: 'Education',    icon: <GraduationCap className="w-4 h-4" />, count: educations.length },
    { key: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" />,         count: certificates.length },
    { key: 'experience',   label: 'Experience',   icon: <Briefcase className="w-4 h-4" />,     count: experiences.length },
  ];

  // ── Loading / Error states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
        <TopNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ─── Instagram-Style Header ─── */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          {/* Cover Photo */}
          <div
            className={`h-44 sm:h-52 relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ${isOwnProfile ? 'group/cover cursor-pointer' : ''}`}
            onClick={isOwnProfile ? (e) => handleImageClick(e, 'cover') : undefined}
          >
            {profile?.coverPhotoUrl && (
              <img
                src={profile.coverPhotoUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover/cover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Info Section */}
          <div className="px-6 sm:px-8 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Profile Picture */}
              <div
                className={`relative shrink-0 ${isOwnProfile ? 'group/avatar cursor-pointer' : ''}`}
                onClick={isOwnProfile ? (e) => handleImageClick(e, 'profile') : undefined}
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-[#1E293B] overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                  {profile?.profileUrl ? (
                    <img
                      src={profile.profileUrl}
                      alt={profile.firstName || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                  {/* Camera overlay — own profile only */}
                  {isOwnProfile && (
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover/avatar:bg-black/30 transition-colors flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons (right aligned on desktop) */}
              <div className="sm:ml-auto flex items-center gap-3 sm:pb-2">
                {isOwnProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditProfileOpen(true)}
                      className="px-5 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Edit Profile
                </button>
                    <Link
                      to="/settings"
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <ConnectionButton
                    status={connectionStatus}
                    loading={connectionLoading}
                    onFollow={handleFollowRequest}
                    onUnfollow={handleUnfollow}
                    onCancel={handleCancelRequest}
                  />
                )}
              </div>
            </div>

            {/* Name & headline */}
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Your Name' : 'Set up your profile'}
              </h1>
              {profile?.headLine && (
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{profile.headLine}</p>
              )}
            </div>

            {/* Stats row — Instagram style (clickable) */}
            <div className="flex items-center gap-8 mb-4">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFollowListOpen('followers'); }}
                className="text-center hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span className="font-bold text-slate-900 dark:text-white">{profile?.followerCount ?? 0}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">followers</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFollowListOpen('following'); }}
                className="text-center hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span className="font-bold text-slate-900 dark:text-white">{profile?.followingCount ?? 0}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">following</span>
              </button>
            </div>

            {/* Bio */}
            {profile?.about && (
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mb-3 max-w-xl">
                {profile.about}
              </p>
            )}

            {/* Location */}
            {(profile?.city || profile?.country) && (
              <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </div>
            )}
              </div>
            </div>

        {/* ─── Tab Navigation (Instagram-style) ─── */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {tab.count}
              </span>
                )}
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
            </div>

          {/* ─── Tab Content ─── */}
          <div className="p-5 sm:p-6">
            {/* Add button — own profile only */}
            {isOwnProfile && (
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'skills')       { setEditingSkill(null); setSkillModalOpen(true); }
                    if (activeTab === 'education')    { setEditingEdu(null); setEduModalOpen(true); }
                    if (activeTab === 'certificates') { setEditingCert(null); setCertModalOpen(true); }
                    if (activeTab === 'experience')   { setEditingExp(null); setExpModalOpen(true); }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add {tabs.find(t => t.key === activeTab)?.label?.replace(/s$/, '')}
                </button>
              </div>
            )}

            {/* ─ Skills Tab ─ */}
            {activeTab === 'skills' && (
              <div>
                {skills.length === 0 ? (
                  <EmptyState icon={<Wrench className="w-10 h-10" />} text="No skills added yet" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{skill.skillName}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${skillLevelBadge(skill.skillLevel)}`}>
                                {skill.skillLevel}
                              </span>
                              {skill.skillExperience > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {skill.skillExperience} yr{skill.skillExperience !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => { setEditingSkill(skill); setSkillModalOpen(true); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(skill.id)}
                                disabled={deletingId === skill.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                {deletingId === skill.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─ Education Tab ─ */}
            {activeTab === 'education' && (
              <div>
                {educations.length === 0 ? (
                  <EmptyState icon={<GraduationCap className="w-10 h-10" />} text="No education added yet" />
                ) : (
                  <div className="space-y-3">
                    {educations.map((edu) => (
                      <div
                        key={edu.id}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{edu.institutionName}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                              </p>
                              {edu.grade && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Grade: {edu.grade}</p>
                              )}
                            </div>
                          </div>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                type="button"
                                onClick={() => { setEditingEdu(edu); setEduModalOpen(true); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEducation(edu.id)}
                                disabled={deletingId === edu.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                {deletingId === edu.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─ Certificates Tab ─ */}
            {activeTab === 'certificates' && (
              <div>
                {certificates.length === 0 ? (
                  <EmptyState icon={<Award className="w-10 h-10" />} text="No certificates added yet" />
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{cert.name}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{cert.issueBy}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Issued: {formatDate(cert.issueDate)}
                              </p>
                              {cert.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cert.description}</p>
                              )}
                              {cert.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1.5"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View credential
                                </a>
                              )}
                            </div>
                          </div>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                type="button"
                                onClick={() => { setEditingCert(cert); setCertModalOpen(true); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCertificate(cert.id)}
                                disabled={deletingId === cert.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                {deletingId === cert.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}
            </div>
          </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─ Experience Tab ─ */}
            {activeTab === 'experience' && (
              <div>
                {experiences.length === 0 ? (
                  <EmptyState icon={<Briefcase className="w-10 h-10" />} text="No experience added yet" />
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{exp.jobTitle}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {exp.companyName}
                                <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-xs">{employmentLabel[exp.employmentType] || exp.employmentType}</span>
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                                {exp.location && (
                                  <>
                                    <span className="mx-1.5">·</span>
                                    {exp.location}
                                  </>
                                )}
                              </p>
                              {exp.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-pre-line line-clamp-3">{exp.description}</p>
                              )}
                            </div>
                          </div>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button
                                type="button"
                                onClick={() => { setEditingExp(exp); setExpModalOpen(true); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
            </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExperience(exp.id)}
                                disabled={deletingId === exp.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                {deletingId === exp.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
                          )}
                        </div>
                      </div>
                    ))}
        </div>
                )}
              </div>
            )}
            </div>
        </div>
      </main>

      {/* ─── Modals ─── */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <SkillForm
        isOpen={skillModalOpen}
        onClose={() => { setSkillModalOpen(false); setEditingSkill(null); }}
        skill={editingSkill}
        onSave={handleSaveSkill}
      />

      <EducationForm
        isOpen={eduModalOpen}
        onClose={() => { setEduModalOpen(false); setEditingEdu(null); }}
        education={editingEdu}
        onSave={handleSaveEducation}
      />

      <CertificateForm
        isOpen={certModalOpen}
        onClose={() => { setCertModalOpen(false); setEditingCert(null); }}
        certificate={editingCert}
        onSave={handleSaveCertificate}
      />

      <WorkExperienceForm
        isOpen={expModalOpen}
        onClose={() => { setExpModalOpen(false); setEditingExp(null); }}
        experience={editingExp}
        onSave={handleSaveExperience}
      />

      {/* ─── Image Options Popup ─── */}
      {imagePopup && (
        <div
          ref={popupRef}
          className="fixed z-50 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 min-w-[160px] animate-in fade-in"
          style={{
            left: `${imagePopup.x}px`,
            top: `${imagePopup.y + 8}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={() => {
              setImageViewOpen({ type: imagePopup.type });
              setImagePopup(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            View Photo
          </button>
          <button
            onClick={() => {
              setImageUpdateOpen({ type: imagePopup.type });
              setImagePopup(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            Update Photo
          </button>
        </div>
      )}

      {/* ─── Image View Modal (Lightbox) ─── */}
      <ImageViewModal
        isOpen={!!imageViewOpen}
        onClose={() => setImageViewOpen(null)}
        imageUrl={imageViewOpen?.type === 'profile' ? (profile?.profileUrl ?? null) : (profile?.coverPhotoUrl ?? null)}
        type={imageViewOpen?.type || 'profile'}
      />

      {/* ─── Image Update Modal ─── */}
      <ImageUpdateModal
        isOpen={!!imageUpdateOpen}
        onClose={() => setImageUpdateOpen(null)}
        type={imageUpdateOpen?.type || 'profile'}
        currentUrl={imageUpdateOpen?.type === 'profile' ? (profile?.profileUrl ?? null) : (profile?.coverPhotoUrl ?? null)}
        onSave={(url) => handleImageSave(imageUpdateOpen?.type || 'profile', url)}
      />

      {/* ─── Followers / Following List Modal ─── */}
      <FollowListModal
        isOpen={!!followListOpen}
        onClose={() => setFollowListOpen(null)}
        type={followListOpen || 'followers'}
        onCountChange={fetchProfile}
      />
    </div>
  );
}

// ── Empty State Component ─────────────────────────────────────────────────
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
      {icon}
      <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">{text}</p>
    </div>
  );
}

// ── Connection Button Component ──────────────────────────────────────────
function ConnectionButton({
  status,
  loading,
  onFollow,
  onUnfollow,
  onCancel,
}: {
  status: string | null;
  loading: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onCancel: () => void;
}) {
  const normalizedStatus = status?.toUpperCase() || 'NONE';

  // Following / Accepted / Connected → show "Following" with unfollow option
  if (['FOLLOWING', 'ACCEPTED', 'CONNECTED'].includes(normalizedStatus)) {
    return (
      <button
        type="button"
        onClick={onUnfollow}
        disabled={loading}
        className="group px-5 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <UserCheck className="w-4 h-4 group-hover:hidden" />
            <UserMinus className="w-4 h-4 hidden group-hover:block" />
          </>
        )}
        <span className="group-hover:hidden">Following</span>
        <span className="hidden group-hover:inline">Unfollow</span>
      </button>
    );
  }

  // Pending → show "Requested" with cancel option
  if (['PENDING', 'REQUESTED'].includes(normalizedStatus)) {
    return (
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-5 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        Requested
      </button>
    );
  }

  // Default (NONE) → show "Follow" button
  return (
    <button
      type="button"
      onClick={onFollow}
      disabled={loading}
      className="px-5 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      Follow
    </button>
  );
}
