import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Plus, Search, Filter,
  Clock, FileText, Users, TrendingUp, Building2, HardHat,
  Factory, Cpu, Ship, ChevronRight, Sparkles, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, user } = useStore();
  
  const statusColors: Record<string, string> = {
    'ready': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'completed': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  
  const typeIcons: Record<string, any> = {
    'real-estate': Building2,
    'construction': HardHat,
    'manufacturing': Factory,
    'industrial': Cpu,
    'oil-gas': Ship,
  };
  
  const recentActivity = [
    { action: 'AI processed site plan for', target: 'Azure Heights Tower', time: '2 min ago', type: 'ingestion' },
    { action: 'Unit 12C reserved by', target: 'Sarah Chen', time: '15 min ago', type: 'sale' },
    { action: 'Stakeholder approval from', target: 'Marcus Johnson', time: '1 hr ago', type: 'approval' },
    { action: 'What-if scenario created:', target: 'Marble Flooring Upgrade', time: '3 hr ago', type: 'scenario' },
  ];
  
  const stats = [
    { label: 'Active Projects', value: '12', change: '+3', icon: Box },
    { label: 'Units Sold This Month', value: '31', change: '+12%', icon: TrendingUp },
    { label: 'AI Insights Generated', value: '248', change: '+45', icon: Sparkles },
    { label: 'Stakeholders Active', value: '89', change: '+8', icon: Users },
  ];
  
  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      {/* Top Nav */}
      <nav className="h-16 border-b border-gray-800 glass-panel flex items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">OneAxis</span>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search projects, units, stakeholders..." 
              className="pl-10 bg-gray-900/50 border-gray-700 text-gray-300 placeholder:text-gray-600"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:block">{user?.name}</span>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Project Dashboard</h1>
            <p className="text-gray-400">Manage and explore all your projects in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => navigate('/project/demo-1')}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-emerald-400 text-xs">{stat.change}</span>
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Projects</h2>
              <Badge variant="outline" className="border-gray-700 text-gray-400">
                {projects.length} Active
              </Badge>
            </div>
            
            {projects.map((project, i) => {
              const TypeIcon = typeIcons[project.type] || Box;
              const available = project.units.filter(u => u.status === 'available').length;
              const sold = project.units.filter(u => u.status === 'sold').length;
              const total = project.units.length || 1;
              const progress = total > 0 ? (sold / total) * 100 : 0;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-panel rounded-xl p-5 cursor-pointer hover:bg-gray-800/50 transition-all group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${statusColors[project.status]}`}>
                            {project.status}
                          </Badge>
                          <span className="text-gray-500 text-xs">
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Total Units</div>
                      <div className="text-white font-semibold">{total}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Available</div>
                      <div className="text-emerald-400 font-semibold">{available}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Sold</div>
                      <div className="text-blue-400 font-semibold">{sold}</div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{Math.round(progress)}% sold</div>
                </motion.div>
              );
            })}
            
            {/* New project card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-2 border-dashed border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
              onClick={() => navigate('/project/demo-1')}
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Create New Project</h3>
              <p className="text-gray-500 text-sm">Upload plans and start your interactive experience</p>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: <Zap className="w-4 h-4" />, label: 'Generate AI Insights', desc: 'Analyze current projects' },
                  { icon: <FileText className="w-4 h-4" />, label: 'Export Reports', desc: 'Download project summaries' },
                  { icon: <Users className="w-4 h-4" />, label: 'Invite Stakeholders', desc: 'Add team members' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                    onClick={() => navigate('/project/demo-1')}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {action.icon}
                    </div>
                    <div>
                      <div className="text-sm text-white">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'sale' ? 'bg-emerald-400' :
                      activity.type === 'approval' ? 'bg-blue-400' :
                      activity.type === 'scenario' ? 'bg-purple-400' :
                      'bg-amber-400'
                    }`} />
                    <div>
                      <div className="text-sm text-gray-300">
                        {activity.action} <span className="text-white font-medium">{activity.target}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Assistant Card */}
            <div className="glass-panel rounded-xl p-5 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">OneAxis AI</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Ask anything about your projects. Get insights, compare scenarios, and make decisions faster.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => navigate('/project/demo-1')}
              >
                Open AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
