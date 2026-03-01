import { MapPin, MessageSquare, UserPlus, Edit2, CheckCircle2, Users, Briefcase } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';

export default function Profile() {
  const portfolioItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    { id: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
    { id: 3, image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800' },
    { id: 4, image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800' },
    { id: 5, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800' },
    { id: 6, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 shadow-sm dark:shadow-none transition-colors duration-200">
          {/* Banner */}
          <div className="h-48 bg-blue-600 relative">
            <button className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="px-8 pb-8">
            {/* Avatar & Actions */}
            <div className="flex justify-between items-end -mt-16 mb-6">
              <div className="relative">
                <img 
                  src="https://i.pravatar.cc/300?img=47" 
                  alt="Sarah Jenkins" 
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1E293B] object-cover bg-white transition-colors duration-200"
                />
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                  Message
                </button>
                <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                  Connect
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sarah Jenkins</h1>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-2">Senior UI/UX Designer | Visual Storyteller</p>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </span>
                <span>•</span>
                <span>500+ connections</span>
              </div>
            </div>

            {/* Skills/Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5 transition-colors duration-200">
                <Edit2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> UI Design
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5 transition-colors duration-200">
                <Users className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" /> User Research
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5 transition-colors duration-200">
                <div className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400">F</div> Figma
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1.5 transition-colors duration-200">
                <div className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400">P</div> Prototyping
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">12.5K</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profile Views</div>
              </div>
              <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">840</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Endorsements</div>
              </div>
              <div className="bg-slate-50 dark:bg-[#0F172A] rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">156</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Projects</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-slate-200 dark:border-slate-800 px-8 flex justify-center gap-8 transition-colors duration-200">
            <button className="py-4 text-sm font-bold text-slate-900 dark:text-white border-b-2 border-blue-600 dark:border-blue-500 flex items-center gap-2">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
              PORTFOLIO
            </button>
            <button className="py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              EXPERIENCE
            </button>
            <button className="py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ENDORSEMENTS
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 group cursor-pointer relative transition-colors duration-200">
              <img 
                src={item.image} 
                alt={`Portfolio item ${item.id}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium">View Project</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
