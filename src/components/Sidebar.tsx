import { Link, useLocation } from 'react-router-dom';
import { Home, Users, User, PlusCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Network', path: '/network', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-colors duration-200">
      {/* Logo */}
      <div className="px-6 pt-5 pb-3">
        <Link to="/" className="flex items-center">
          {/* Light mode: icon + text */}
          <div className="flex dark:hidden items-center gap-2">
            <div className="w-12 h-12 shrink-0">
              <img src="/light-mobile.png" alt="SocialJob" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SocialJob
            </span>
          </div>
          {/* Dark mode: icon + text */}
          <div className="hidden dark:flex items-center gap-2">
            <div className="w-12 h-12 shrink-0">
              <img src="/dark-mobile.png" alt="SocialJob" className="w-full h-full object-contain mix-blend-screen" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
              SocialJob
            </span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 pb-4 flex items-center gap-3">
        <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-10 h-10 rounded-full border-2 border-blue-500" />
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{currentUser?.username || 'Alex Morgan'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Product Designer</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
          <PlusCircle className="w-5 h-5" />
          New Post
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-3 rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
