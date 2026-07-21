import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Shield, Globe, CheckCircle,
  Key, Palette, Plus, ChevronRight, Lock, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: number;
  lastActive: string;
  status: 'active' | 'invited' | 'inactive';
}

interface Workspace {
  id: string;
  name: string;
  projectCount: number;
  memberCount: number;
  theme: string;
  domain?: string;
}

const ROLES = [
  { id: 'owner', name: 'Owner', description: 'Full control, billing, can delete org', count: 1 },
  { id: 'admin', name: 'Admin', description: 'Manage projects, members, settings', count: 2 },
  { id: 'pm', name: 'Project Manager', description: 'Create/manage projects, view all data', count: 4 },
  { id: 'agent', name: 'Sales Agent', description: 'View assigned projects, manage leads', count: 12 },
  { id: 'designer', name: 'Designer', description: 'Upload models, manage 3D assets', count: 3 },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access to assigned projects', count: 6 },
];

const MEMBERS: OrgMember[] = [
  { id: 'm1', name: 'David Chen', email: 'david@developer.com.au', role: 'Owner', projects: 8, lastActive: 'Now', status: 'active' },
  { id: 'm2', name: 'Sarah Williams', email: 'sarah@developer.com.au', role: 'Admin', projects: 8, lastActive: '2 min ago', status: 'active' },
  { id: 'm3', name: 'Mike Ross', email: 'mike@developer.com.au', role: 'Project Manager', projects: 5, lastActive: '15 min ago', status: 'active' },
  { id: 'm4', name: 'Lisa Park', email: 'lisa@developer.com.au', role: 'Designer', projects: 4, lastActive: '1 hr ago', status: 'active' },
  { id: 'm5', name: 'James Wright', email: 'james@developer.com.au', role: 'Sales Agent', projects: 3, lastActive: '3 hr ago', status: 'active' },
  { id: 'm6', name: 'Emma Green', email: 'emma@developer.com.au', role: 'Sales Agent', projects: 2, lastActive: '1 day ago', status: 'active' },
  { id: 'm7', name: 'Tom Baker', email: 'tom@agency.com.au', role: 'Viewer', projects: 2, lastActive: '2 days ago', status: 'active' },
  { id: 'm8', name: 'New Hire', email: 'pending@developer.com.au', role: 'Sales Agent', projects: 0, lastActive: '-', status: 'invited' },
];

const WORKSPACES: Workspace[] = [
  { id: 'w1', name: 'Harbour Residences', projectCount: 1, memberCount: 8, theme: 'Navy & Gold' },
  { id: 'w2', name: 'Metro Towers', projectCount: 1, memberCount: 6, theme: 'Charcoal & White' },
  { id: 'w3', name: 'Coastal Living Series', projectCount: 3, memberCount: 12, theme: 'Sand & Teal' },
];

export default function OrgManager() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'roles' | 'workspaces'>('overview');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const totalMembers = MEMBERS.filter(m => m.status === 'active').length;
  const totalProjects = WORKSPACES.reduce((a, w) => a + w.projectCount, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Organisation</h2>
            <p className="text-gray-400 text-sm">Workspaces, roles & multi-tenant access</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Members</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalMembers}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Roles</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{ROLES.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Workspaces</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{WORKSPACES.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Projects</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{totalProjects}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-6 w-fit">
        {(['overview', 'members', 'roles', 'workspaces'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-5">
            <h4 className="text-sm text-white font-medium mb-3">Organisation Hierarchy</h4>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center min-w-[140px]">
                <Building2 className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-white font-medium">Stedaxis Pty Ltd</div>
                <div className="text-[10px] text-gray-400">Parent Org</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
              <div className="flex gap-2">
                {WORKSPACES.map(w => (
                  <div key={w.id} className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 text-center min-w-[100px]">
                    <div className="text-xs text-white font-medium">{w.name}</div>
                    <div className="text-[10px] text-gray-400">{w.projectCount} projects</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-sm text-white font-medium mb-2">Security</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Lock className="w-3 h-3" />Row-level security</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Eye className="w-3 h-3" />Audit logging</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Key className="w-3 h-3" />SSO (SAML/OIDC)</span>
                  <span className="text-[10px] text-amber-400">Enterprise</span>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-sm text-white font-medium mb-2">White-Label</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Palette className="w-3 h-3" />Custom themes</span>
                  <span className="text-emerald-400 text-[10px]">{WORKSPACES.length} active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Globe className="w-3 h-3" />Custom domains</span>
                  <span className="text-[10px] text-amber-400">2 configured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500">{MEMBERS.length} total • {MEMBERS.filter(m => m.status === 'invited').length} pending</span>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
              <Plus className="w-3.5 h-3.5 mr-1" />Invite Member
            </Button>
          </div>
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-medium">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{m.name}</span>
                  {m.status === 'invited' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400">Invited</span>}
                </div>
                <div className="text-xs text-gray-500">{m.email} • {m.role}</div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>{m.projects} projects</div>
                <div>{m.lastActive}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid md:grid-cols-2 gap-3">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
              className={`glass-panel rounded-xl p-4 cursor-pointer transition-all border ${
                selectedRole === role.id ? 'border-blue-500/30' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{role.name}</span>
                <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">{role.count} members</span>
              </div>
              <p className="text-xs text-gray-500">{role.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'workspaces' && (
        <div className="space-y-3">
          {WORKSPACES.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">{w.name}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{w.projectCount} projects</span>
                    <span>{w.memberCount} members</span>
                    <span className="flex items-center gap-1"><Palette className="w-3 h-3" />{w.theme}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
