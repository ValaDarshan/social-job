import { useTheme } from '../contexts/ThemeContext';
import TopNavbar from '../components/TopNavbar';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Appearance</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Customize how ProStream looks on your device.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="h-8 w-8 mb-3" />
                  <span className="font-medium">Light</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="h-8 w-8 mb-3" />
                  <span className="font-medium">Dark</span>
                </button>
                
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Monitor className="h-8 w-8 mb-3" />
                  <span className="font-medium">System</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
