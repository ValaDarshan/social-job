import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Users, Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TopNavbar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Network', path: '/network', icon: Users },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
  ];

  return (
    <nav className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center shrink-0">
            {/* Mobile: icon only */}
            <div className="w-12 h-12 shrink-0 sm:hidden block dark:hidden">
              <img src="/light-mobile.png" alt="SocialJob" className="w-full h-full object-contain" />
            </div>
            <div className="w-12 h-12 shrink-0 hidden dark:block sm:!hidden">
              <img src="/dark-mobile.png" alt="SocialJob" className="w-full h-full object-contain mix-blend-screen" />
            </div>
            {/* Desktop light: icon + text */}
            <div className="hidden sm:flex dark:!hidden items-center gap-2">
              <div className="w-12 h-12 shrink-0">
                <img src="/light-mobile.png" alt="SocialJob" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SocialJob
              </span>
            </div>
            {/* Desktop dark: icon + text */}
            <div className="hidden sm:dark:flex items-center gap-2">
              <div className="w-12 h-12 shrink-0">
                <img src="/dark-mobile.png" alt="SocialJob" className="w-full h-full object-contain mix-blend-screen" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
                SocialJob
              </span>
            </div>
          </Link>

          {/* Center: Search */}
          <div className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Search professionals, companies, or trends..."
            />
          </div>

          {/* Right: Nav tabs + profile */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex flex-col items-center justify-center h-16 px-2 border-b-2 transition-colors ${
                      isActive ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <Link to="/profile" className="shrink-0">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700" />
            </Link>
            <button 
              onClick={logout}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
