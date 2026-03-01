import { Search, MoreHorizontal, ThumbsUp, Lightbulb, Users, Share2, Info } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const posts = [
    {
      id: 1,
      user: {
        name: 'Sarah Jenkins',
        title: 'Senior UX at FinCorp',
        time: '2h ago',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
      content: 'Just launched the new dashboard! Focused on clarity and accessibility. We reduced visual clutter by 40% while keeping all critical metrics above the fold. Thoughts on the new color palette?',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
      stats: { likes: '1.2k', insightful: '342', collaborate: '12' },
    },
    {
      id: 2,
      user: {
        name: 'David Chen',
        title: 'Architect & Visualizer',
        time: '5h ago',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
      content: 'Sustainable living concepts for the upcoming urban project in Seattle. Using modular timber construction. #Architecture #Sustainability',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      stats: { likes: '856', insightful: '120', collaborate: '5' },
    },
  ];

  const news = [
    { title: 'The Future of AI in Design Systems', source: 'TechCrunch', time: '4h ago', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200' },
    { title: 'Remote Work Trends 2024 Report', source: 'Forbes', time: '6h ago', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=200' },
    { title: 'Networking in the Digital Age', source: 'HBR', time: '1d ago', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' },
  ];

  const people = [
    { name: 'Elena Rodriguez', title: 'VP of Design', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Mark Thompson', title: 'Creative Dir.', avatar: 'https://i.pravatar.cc/150?img=8' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex transition-colors duration-200">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex justify-center">
        <div className="w-full max-w-3xl px-8 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Search for professionals, companies, or tags..."
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium whitespace-nowrap">All Posts</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700">#ProductDesign</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700">#UXResearch</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700">#TechInnovation</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700">#VisualArts</button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-700" />
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{post.user.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{post.user.title} • {post.user.time}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                
                <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900">
                  <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                </div>
                
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm font-medium">
                      <ThumbsUp className="w-4 h-4" />
                      {post.stats.likes}
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors text-sm font-medium">
                      <Lightbulb className="w-4 h-4" />
                      Insightful
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition-colors text-sm font-medium">
                      <Users className="w-4 h-4" />
                      Collaborate
                    </button>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-slate-200 dark:border-slate-800 p-6 hidden xl:block bg-white dark:bg-transparent transition-colors duration-200">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Professional News</h3>
            <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-4">
            {news.map((item, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 group-hover:border-blue-500 transition-colors" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.source} • {item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mt-4 flex items-center justify-center w-full">
            Show more <MoreHorizontal className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">People to Follow</h3>
          <div className="space-y-4">
            {people.map((person, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{person.name}</h4>
                    <p className="text-xs text-slate-500">{person.title}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-400 dark:text-slate-500 space-y-2">
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">About</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Accessibility</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy & Terms</a>
          </div>
          <p className="pt-2">© 2024 ProStream Inc.</p>
        </div>
      </aside>
    </div>
  );
}
