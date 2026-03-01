import { Search, Plus, Folder, Clock, CheckCircle2, MoreVertical, Users, MessageSquare, Paperclip, Calendar } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';

export default function Projects() {
  const activeProjects = [
    { id: 1, name: 'Fintech Dashboard Redesign', client: 'GlobalBank Inc.', status: 'In Progress', progress: 65, color: 'bg-blue-500' },
    { id: 2, name: 'Eco Living Architecture', client: 'Green Homes LLC', status: 'Review', progress: 90, color: 'bg-green-500' },
    { id: 3, name: 'Brand Identity System', client: 'TechNova Startup', status: 'Planning', progress: 15, color: 'bg-purple-500' },
    { id: 4, name: 'Mobile App UI Kit', client: 'Internal Project', status: 'In Progress', progress: 40, color: 'bg-orange-500' },
  ];

  const teamMembers = [
    { name: 'Sarah Jenkins', role: 'Lead Designer', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'David Chen', role: 'Architect', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Elena Rodriguez', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];

  const tasks = [
    { id: 1, title: 'Finalize color palette', assignee: 'Sarah Jenkins', due: 'Today', status: 'Completed', priority: 'High' },
    { id: 2, title: 'Review wireframes with client', assignee: 'Elena Rodriguez', due: 'Tomorrow', status: 'In Progress', priority: 'High' },
    { id: 3, title: 'Create component library', assignee: 'David Chen', due: 'Oct 24', status: 'To Do', priority: 'Medium' },
    { id: 4, title: 'Prepare presentation deck', assignee: 'Sarah Jenkins', due: 'Oct 26', status: 'To Do', priority: 'Low' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex flex-col transition-colors duration-200">
      <TopNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Project List */}
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex flex-col hidden md:flex transition-colors duration-200">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
              <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Search projects..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Active Projects</div>
            
            {activeProjects.map((project) => (
              <div 
                key={project.id} 
                className={`p-4 rounded-xl cursor-pointer transition-colors border ${
                  project.id === 1 
                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <h3 className={`font-semibold text-sm ${project.id === 1 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {project.name}
                    </h3>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-slate-500 ml-6 mb-3">{project.client}</p>
                
                <div className="ml-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{project.status}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${project.color}`} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content - Project Details */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
          <div className="max-w-5xl mx-auto p-6 lg:p-10">
            {/* Project Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                    <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fintech Dashboard Redesign</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">GlobalBank Inc. • Due Nov 15, 2024</p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex -space-x-3">
                  {teamMembers.map((member, i) => (
                    <img key={i} src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border-2 border-slate-50 dark:border-[#0F172A]" title={member.name} />
                  ))}
                  <button className="w-10 h-10 rounded-full border-2 border-slate-50 dark:border-[#0F172A] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  Share Project
                </button>
              </div>
            </div>

            {/* Project Stats/Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2">
                  <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Time Tracked</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">124h <span className="text-lg text-slate-500 font-normal">/ 200h</span></div>
              </div>
              <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                  <span className="font-medium">Tasks Completed</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">24 <span className="text-lg text-slate-500 font-normal">/ 36</span></div>
              </div>
              <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  <span className="font-medium">Comments</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">86</div>
              </div>
              <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2">
                  <Paperclip className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  <span className="font-medium">Files Shared</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">12</div>
              </div>
            </div>

            {/* Tasks & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Task List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Tasks</h2>
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">View All</button>
                </div>
                
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                          }`}>
                            {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div>
                            <h4 className={`font-medium ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {task.assignee}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {task.due}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                            task.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20' :
                            'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                          }`}>
                            {task.priority}
                          </span>
                          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity</h2>
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">View All</button>
                </div>
                
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                        <img src="https://i.pravatar.cc/150?img=47" alt="Sarah" className="w-full h-full rounded-full" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm dark:shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 dark:text-slate-200 text-sm">Sarah Jenkins</div>
                          <time className="text-xs font-medium text-slate-500">2h ago</time>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Uploaded new wireframes for the dashboard.</div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                        <img src="https://i.pravatar.cc/150?img=5" alt="Elena" className="w-full h-full rounded-full" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm dark:shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 dark:text-slate-200 text-sm">Elena Rodriguez</div>
                          <time className="text-xs font-medium text-slate-500">5h ago</time>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Approved the color palette.</div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                        <img src="https://i.pravatar.cc/150?img=11" alt="David" className="w-full h-full rounded-full" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm dark:shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 dark:text-slate-200 text-sm">David Chen</div>
                          <time className="text-xs font-medium text-slate-500">1d ago</time>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Commented on the typography choices.</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
