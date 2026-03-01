import { Search, Filter, TrendingUp, Star, Clock, Heart, Eye } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';

export default function Explore() {
  const categories = ['All', 'UI/UX', 'Illustration', 'Architecture', 'Branding', 'Motion', 'Typography'];
  
  const exploreItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', title: 'Fintech Dashboard', author: 'Sarah Jenkins', likes: '1.2k', views: '4.5k', height: 'h-64' },
    { id: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', title: 'Eco Living', author: 'David Chen', likes: '856', views: '2.1k', height: 'h-96' },
    { id: 3, image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800', title: 'Brand Identity', author: 'Elena Rodriguez', likes: '2.4k', views: '8.9k', height: 'h-80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800', title: 'Mobile App UI', author: 'Mark Thompson', likes: '542', views: '1.8k', height: 'h-72' },
    { id: 5, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800', title: 'Web Design', author: 'Alex Morgan', likes: '3.1k', views: '12k', height: 'h-96' },
    { id: 6, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800', title: '3D Render', author: 'Sarah Jenkins', likes: '920', views: '3.4k', height: 'h-64' },
    { id: 7, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', title: 'Logo Design', author: 'David Chen', likes: '1.5k', views: '5.2k', height: 'h-80' },
    { id: 8, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', title: 'Marketing Campaign', author: 'Elena Rodriguez', likes: '4.2k', views: '15k', height: 'h-72' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Inspiration</h1>
            <p className="text-slate-600 dark:text-slate-400">Discover top creative work from professionals worldwide.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Search projects, tags..."
              />
            </div>
            <button className="px-4 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white flex items-center gap-2 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Categories & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <TrendingUp className="w-4 h-4" /> Trending
            </button>
            <button className="px-4 py-2 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium flex items-center gap-2 transition-colors">
              <Star className="w-4 h-4" /> Featured
            </button>
            <button className="px-4 py-2 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium flex items-center gap-2 transition-colors">
              <Clock className="w-4 h-4" /> Recent
            </button>
          </div>
        </div>

        {/* Masonry Grid (Simulated with columns) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {exploreItems.map((item) => (
            <div key={item.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer">
              <img 
                src={item.image} 
                alt={item.title} 
                className={`w-full object-cover ${item.height} group-hover:scale-105 transition-transform duration-500`}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{item.author}</p>
                
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" /> {item.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> {item.views}
                    </span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
