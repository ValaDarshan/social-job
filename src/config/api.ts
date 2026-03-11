// Centralized API configuration
// All endpoints are read from environment variables for easy switching between environments

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9012';
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_LOGIN || '/auth/login'}`,
    REGISTER: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_REGISTER || '/auth/register'}`,
    FORGOT_PASSWORD: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_FORGOT_PASSWORD || '/auth/forgot-password'}`,
    RESET_PASSWORD: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_RESET_PASSWORD || '/auth/reset-password'}`,
    VERIFY_EMAIL: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_VERIFY_EMAIL || '/auth/verify'}`,
    REFRESH_TOKEN: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_REFRESH_TOKEN || '/auth/refresh-token'}`,
    LOGOUT: `${AUTH_BASE_URL}${import.meta.env.VITE_AUTH_LOGOUT || '/auth/logout'}`,
  },
  SESSIONS: `${AUTH_BASE_URL}${import.meta.env.VITE_SESSIONS || '/sessions'}`,
  PROFILE: {
    BASE: `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE || '/profile'}`,
    BY_USER_ID: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE || '/profile'}/${userId}`,
    SKILLS: `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_SKILLS || '/profile/skills'}`,
    SKILLS_BY_USER_ID: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_SKILLS || '/profile/skills'}/${userId}`,
    SKILL_BY_ID: (id: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_SKILLS || '/profile/skills'}/${id}`,
    EDUCATION: `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_EDUCATION || '/profile/education'}`,
    EDUCATION_BY_USER_ID: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_EDUCATION || '/profile/education'}/${userId}`,
    EDUCATION_BY_ID: (id: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_EDUCATION || '/profile/education'}/${id}`,
    CERTIFICATES: `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_CERTIFICATES || '/profile/certificates'}`,
    CERTIFICATES_BY_USER_ID: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_CERTIFICATES || '/profile/certificates'}/${userId}`,
    CERTIFICATE_BY_ID: (id: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_CERTIFICATES || '/profile/certificates'}/${id}`,
    WORK_EXPERIENCE: `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_WORK_EXPERIENCE || '/profile/work-experience'}`,
    WORK_EXPERIENCE_BY_USER_ID: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_WORK_EXPERIENCE || '/profile/work-experience'}/${userId}`,
    WORK_EXPERIENCE_BY_ID: (id: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_PROFILE_WORK_EXPERIENCE || '/profile/work-experience'}/${id}`,
  },
  CONNECTIONS: {
    REQUEST: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/request/${userId}`,
    ACCEPT: (connectionId: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/accept/${connectionId}`,
    REJECT: (connectionId: number) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/reject/${connectionId}`,
    UNFOLLOW: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/unfollow/${userId}`,
    FOLLOWERS: `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/followers`,
    FOLLOWING: `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/following`,
    PENDING_RECEIVED: `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/pending/received`,
    PENDING_SENT: `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/pending/sent`,
    STATUS: (targetUserId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/status/${targetUserId}`,
    COUNT: (userId: string) => `${USER_SERVICE_URL}${import.meta.env.VITE_CONNECTIONS || '/connections'}/count/${userId}`,
  },
} as const;
