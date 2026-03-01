import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Users, Briefcase, MessageSquare, Bell, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TopNavbar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Discovery', path: '/explore', icon: Globe },
    { name: 'Network', path: '/network', icon: Users },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Messaging', path: '/projects', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <nav className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">ProStream</span>
            </Link>

            <div className="relative hidden md:block w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Search professionals, companies, or visual trends..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
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

            <div className="flex items-center gap-4">
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <MessageSquare className="h-5 w-5" />
              </button>
              <Link to="/profile">
                <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700" />
              </Link>
              <button 
                onClick={logout}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-2"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
