import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Eye, Workflow, Shield, ShieldCheck, Bell, Palette,
  CreditCard, FileText,
  Lock, Globe, Smartphone, Mail, MessageSquare,
  Settings, CheckCircle2, Circle,
  Play, Save, Zap, Clock,
  Monitor, Sliders, Webhook,
  TrendingUp, UserCheck,
  GitBranch
} from 'lucide-react';
import { Briefcase as BriefcaseLucide } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StakeholderVisibilityPanel from './StakeholderVisibilityPanel';
import PermissionsMatrix from './PermissionsMatrix';
import WorkflowWizard from './WorkflowWizard';
import ExperiencePreview from './ExperiencePreview';
import TenantHierarchyFlow from './TenantHierarchyFlow';

/* ──────────────────────────────────────────
   STATUS BADGE — Draft / Live / Archived
   ────────────────────────────────────────── */
export function StatusBadge({ status }: { status: 'draft' | 'live' | 'archived' | 'pending-review' }) {
  const config = {
    draft: { bg: 'bg-slate-100 text-slate-600 border-slate-300', icon: Circle, label: 'Draft' },
    live: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300', icon: CheckCircle2, label: 'Live' },
    archived: { bg: 'bg-gray-100 text-gray-500 border-gray-300', icon: ArchiveIcon, label: 'Archived' },
    'pending-review': { bg: 'bg-amber-50 text-amber-700 border-amber-300', icon: Clock, label: 'Pending Review' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.bg}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}
function ArchiveIcon() { return <div className="w-3 h-3 rounded-sm border border-current" />; }

/* ──────────────────────────────────────────
   DUAL-PIVOT SETTINGS HUB
   ├─ Tenant Management (Internal)
   └─ Stakeholder Experiences (External)
   ────────────────────────────────────────── */

const tenantNavItems = [
  { id: 'profile', label: 'Workspace Profile', icon: Building2, desc: 'Branding, domain, defaults' },
  { id: 'team', label: 'Team & Roles', icon: Users, desc: 'Members, RBAC, invitations' },
  { id: 'permissions', label: 'Permission Matrix', icon: Shield, desc: 'Feature access by role' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, desc: 'Subscription, usage' },
  { id: 'integrations', label: 'Integrations', icon: Webhook, desc: 'CRM, ERP, webhooks' },
  { id: 'security', label: 'Security', icon: Lock, desc: 'SSO, 2FA, audit log' },
];

const stakeholderNavItems = [
  { id: 'hierarchy', label: 'Hierarchy & Flow', icon: GitBranch, desc: 'Tenant → Stakeholder → End-User' },
  { id: 'visibility', label: 'Visibility Controls', icon: Eye, desc: 'Data exposure guardrails' },
  { id: 'workflows', label: 'Workflow Wizard', icon: Workflow, desc: 'Onboarding, approvals, automations' },
  { id: 'experiences', label: 'End-User Experiences', icon: Monitor, desc: 'Interface customization' },
  { id: 'notifications', label: 'Notification Rules', icon: Bell, desc: 'Alerts, triggers, channels' },
  { id: 'preview', label: 'Live Preview', icon: Play, desc: 'View as end-customer' },
];

export default function SettingsHub() {
  const [activePivot, setActivePivot] = useState<'tenant' | 'stakeholder'>('tenant');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPreview, setShowPreview] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  const handleSave = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const currentNav = activePivot === 'tenant' ? tenantNavItems : stakeholderNavItems;

  return (
    <div className="h-full flex flex-col bg-[#0a0e1a] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Settings Hub</h1>
            <p className="text-xs text-gray-500">Configure your platform and stakeholder experiences</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {savedIndicator && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </motion.span>
          )}
          <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Dual-Pivot Tabs */}
      <div className="flex border-b border-gray-800 px-6 flex-shrink-0">
        <button
          onClick={() => { setActivePivot('tenant'); setActiveTab('profile'); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            activePivot === 'tenant'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Tenant Management
          <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Internal</span>
        </button>
        <button
          onClick={() => { setActivePivot('stakeholder'); setActiveTab('hierarchy'); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            activePivot === 'stakeholder'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Stakeholder Experiences
          <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">External</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-gray-800 flex-shrink-0 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {activePivot === 'tenant' ? 'Internal Configuration' : 'External Configuration'}
            </h3>
            <nav className="space-y-1">
              {currentNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      activeTab === item.id
                        ? activePivot === 'tenant'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activePivot}-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* === TENANT MANAGEMENT VIEWS === */}
              {activePivot === 'tenant' && activeTab === 'profile' && <WorkspaceProfilePanel />}
              {activePivot === 'tenant' && activeTab === 'team' && <TeamRolesPanel />}
              {activePivot === 'tenant' && activeTab === 'permissions' && <PermissionsMatrix />}
              {activePivot === 'tenant' && activeTab === 'billing' && <BillingPanel />}
              {activePivot === 'tenant' && activeTab === 'integrations' && <IntegrationsPanel />}
              {activePivot === 'tenant' && activeTab === 'security' && <SecurityPanel />}

              {/* === STAKEHOLDER EXPERIENCE VIEWS === */}
              {activePivot === 'stakeholder' && activeTab === 'hierarchy' && <TenantHierarchyFlow />}
              {activePivot === 'stakeholder' && activeTab === 'visibility' && <StakeholderVisibilityPanel />}
              {activePivot === 'stakeholder' && activeTab === 'workflows' && <WorkflowWizard />}
              {activePivot === 'stakeholder' && activeTab === 'experiences' && <EndUserExperiencesPanel />}
              {activePivot === 'stakeholder' && activeTab === 'notifications' && <NotificationRulesPanel />}
              {activePivot === 'stakeholder' && activeTab === 'preview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Experience Preview</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      See exactly what your end-customers and stakeholders will interact with.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
                    <Monitor className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Live Preview Mode</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                      Open a sandbox environment that renders the stakeholder portal based on your current visibility and workflow settings.
                    </p>
                    <Button
                      onClick={() => setShowPreview(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View as End-Customer
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { role: 'End-Customer', desc: 'What buyers see', icon: UserCheck, color: 'blue' },
                      { role: 'External Agent', desc: 'What agents see', icon: BriefcaseLucide, color: 'purple' },
                      { role: 'Investor', desc: 'What investors see', icon: TrendingUp, color: 'emerald' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => setShowPreview(true)}
                        className={`p-4 rounded-xl border border-gray-700 bg-gray-800/30 hover:border-${item.color}-500/30 hover:bg-${item.color}-500/5 transition-all text-left`}
                      >
                        <item.icon className={`w-8 h-8 text-${item.color}-400 mb-3`} />
                        <h4 className="text-sm font-semibold text-white">{item.role}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Preview Modal */}
      <ExperiencePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}


/* ═══════════════════════════════════════════
   WORKSPACE PROFILE PANEL
   ═══════════════════════════════════════════ */
function WorkspaceProfilePanel() {
  const [profile, setProfile] = useState({
    name: 'Stedaxis Development',
    subdomain: 'stedaxis',
    timezone: 'Australia/Sydney',
    currency: 'AUD',
    language: 'en',
    logo: null as string | null,
    favicon: null as string | null,
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Workspace Profile</h2>
        <p className="text-sm text-gray-400 mt-1">Configure your organization's branding and defaults.</p>
      </div>

      {/* Branding Card */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Branding</h3>
          <StatusBadge status="live" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Organization Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Subdomain</label>
            <div className="flex">
              <input
                value={profile.subdomain}
                onChange={(e) => setProfile({ ...profile, subdomain: e.target.value })}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-l-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-lg px-3 py-2 text-sm text-gray-500">.oneaxis.live</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.primaryColor}
                onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-gray-300 font-mono">{profile.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.accentColor}
                onChange={(e) => setProfile({ ...profile, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-gray-300 font-mono">{profile.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Defaults Card */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">System Defaults</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Timezone', value: profile.timezone, options: ['Australia/Sydney', 'Asia/Dubai', 'America/New_York', 'Europe/London'] },
            { label: 'Currency', value: profile.currency, options: ['AUD', 'USD', 'AED', 'EUR', 'GBP'] },
            { label: 'Language', value: profile.language, options: ['en', 'zh', 'ar', 'hi', 'vi'] },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-gray-400 block mb-1.5">{field.label}</label>
              <select
                value={field.value}
                onChange={(e) => setProfile({ ...profile, [field.label.toLowerCase()]: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TEAM & ROLES PANEL
   ═══════════════════════════════════════════ */
function TeamRolesPanel() {
  const [members] = useState([
    { id: '1', name: 'Alex Morgan', email: 'alex@stedaxis.com', role: 'Owner', status: 'active', lastActive: '2 min ago', avatar: 'AM' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@stedaxis.com', role: 'Admin', status: 'active', lastActive: '15 min ago', avatar: 'SC' },
    { id: '3', name: 'Marcus Johnson', email: 'marcus@stedaxis.com', role: 'Project Manager', status: 'active', lastActive: '1 hr ago', avatar: 'MJ' },
    { id: '4', name: 'Khalid Al-Mansouri', email: 'khalid@stedaxis.com', role: 'Sales Agent', status: 'active', lastActive: '3 hr ago', avatar: 'KA' },
    { id: '5', name: 'Priya Sharma', email: 'priya@stedaxis.com', role: 'Designer', status: 'away', lastActive: '5 hr ago', avatar: 'PS' },
    { id: '6', name: 'James Wilson', email: 'james@stedaxis.com', role: 'Viewer', status: 'inactive', lastActive: '2 days ago', avatar: 'JW' },
    { id: '7', name: 'Li Wei', email: 'li@stedaxis.com', role: 'Sales Agent', status: 'active', lastActive: '30 min ago', avatar: 'LW' },
    { id: '8', name: 'Emma Thompson', email: 'emma@stedaxis.com', role: 'Project Manager', status: 'active', lastActive: '45 min ago', avatar: 'ET' },
  ]);

  const roleColors: Record<string, string> = {
    Owner: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    'Project Manager': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Sales Agent': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Designer: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Viewer: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500',
    away: 'bg-amber-500',
    inactive: 'bg-gray-500',
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Team & Roles</h2>
          <p className="text-sm text-gray-400 mt-1">Manage workspace members and their access levels.</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
          <Users className="w-3.5 h-3.5 mr-1.5" /> Invite Member
        </Button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-6 gap-3">
        {Object.entries(roleColors).map(([role, colorClass]) => {
          const count = members.filter((m) => m.role === role).length;
          return (
            <div key={role} className={`p-3 rounded-xl border ${colorClass} bg-opacity-5`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-[10px] opacity-80 mt-0.5">{role}</div>
            </div>
          );
        })}
      </div>

      {/* Members Table */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_80px] gap-4 px-5 py-3 border-b border-gray-700 text-xs text-gray-500 font-medium uppercase">
          <span>Member</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last Active</span>
        </div>
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-[1fr_120px_100px_80px] gap-4 px-5 py-3 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {member.avatar}
              </div>
              <div>
                <div className="text-sm text-white font-medium">{member.name}</div>
                <div className="text-xs text-gray-500">{member.email}</div>
              </div>
            </div>
            <Badge className={`${roleColors[member.role]} text-xs w-fit`}>
              {member.role}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
              <span className="text-xs text-gray-400 capitalize">{member.status}</span>
            </div>
            <span className="text-xs text-gray-500">{member.lastActive}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BILLING PANEL
   ═══════════════════════════════════════════ */
function BillingPanel() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Billing & Plans</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your subscription and usage.</p>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">Current Plan</Badge>
            <h3 className="text-2xl font-bold text-white">Professional</h3>
            <p className="text-sm text-gray-400 mt-1">$2,499/month — Renews Aug 15, 2026</p>
          </div>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Change Plan
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Projects Used', used: 12, limit: 25, color: 'blue' },
          { label: 'Team Seats', used: 8, limit: 15, color: 'purple' },
          { label: 'Storage', used: 45, limit: 100, color: 'emerald', unit: 'GB' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2">{item.label}</div>
            <div className="text-2xl font-bold text-white">
              {item.used}<span className="text-sm text-gray-500">/{item.limit}{item.unit || ''}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${item.color}-500 rounded-full transition-all`}
                style={{ width: `${(item.used / item.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATIONS PANEL
   ═══════════════════════════════════════════ */
function IntegrationsPanel() {
  const [integrations] = useState([
    { id: '1', name: 'Salesforce CRM', category: 'CRM', status: 'connected', icon: 'SF', lastSync: '2 min ago' },
    { id: '2', name: 'HubSpot', category: 'CRM', status: 'connected', icon: 'HS', lastSync: '15 min ago' },
    { id: '3', name: 'Slack', category: 'Communication', status: 'connected', icon: 'SL', lastSync: '1 hr ago' },
    { id: '4', name: 'WhatsApp Business', category: 'Communication', status: 'configured', icon: 'WA', lastSync: '—' },
    { id: '5', name: 'Stripe', category: 'Payments', status: 'connected', icon: 'ST', lastSync: '5 min ago' },
    { id: '6', name: 'Xero', category: 'Accounting', status: 'disconnected', icon: 'XR', lastSync: '—' },
    { id: '7', name: 'Mailchimp', category: 'Marketing', status: 'configured', icon: 'MC', lastSync: '—' },
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Integrations</h2>
        <p className="text-sm text-gray-400 mt-1">Connect your existing tools and services.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center gap-4 p-4 bg-gray-800/40 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
              {integration.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-white">{integration.name}</h4>
                <StatusBadge
                  status={integration.status === 'connected' ? 'live' : integration.status === 'configured' ? 'pending-review' : 'draft'}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{integration.category} · Last sync: {integration.lastSync}</p>
            </div>
            <Button
              size="sm"
              variant={integration.status === 'connected' ? 'outline' : 'default'}
              className={integration.status === 'connected'
                ? 'border-gray-600 text-gray-400 hover:bg-gray-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
              }
            >
              {integration.status === 'connected' ? 'Manage' : integration.status === 'configured' ? 'Finish' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECURITY PANEL
   ═══════════════════════════════════════════ */
function SecurityPanel() {
  const [settings] = useState({
    ssoEnabled: true,
    ssoProvider: 'Google Workspace',
    mfaRequired: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    auditLogEnabled: true,
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Security</h2>
        <p className="text-sm text-gray-400 mt-1">Configure authentication and access policies.</p>
      </div>

      {[
        {
          title: 'Single Sign-On (SSO)',
          desc: settings.ssoProvider,
          status: settings.ssoEnabled ? 'live' as const : 'draft' as const,
          icon: Globe,
        },
        {
          title: 'Multi-Factor Authentication',
          desc: 'Required for all admin roles',
          status: settings.mfaRequired ? 'live' as const : 'draft' as const,
          icon: ShieldCheck,
        },
        {
          title: 'Audit Logging',
          desc: 'All actions logged with IP and timestamp',
          status: settings.auditLogEnabled ? 'live' as const : 'draft' as const,
          icon: FileText,
        },
        {
          title: 'IP Whitelisting',
          desc: 'Restrict access by IP range',
          status: settings.ipWhitelist ? 'live' as const : 'draft' as const,
          icon: Lock,
        },
      ].map((item) => (
        <div key={item.title} className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5 text-gray-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <button
            className={`relative w-11 h-6 rounded-full transition-colors ${
              item.status === 'live' ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                item.status === 'live' ? 'left-5.5 translate-x-0' : 'left-0.5'
              }`}
              style={{ left: item.status === 'live' ? '22px' : '2px' }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   END-USER EXPERIENCES PANEL
   ═══════════════════════════════════════════ */
function EndUserExperiencesPanel() {
  const [experiences, setExperiences] = useState([
    { id: 'buyer-portal', name: 'Buyer Portal', enabled: true, status: 'live' as const, description: 'Post-purchase project tracking', audience: 'End-Customers' },
    { id: 'agent-app', name: 'Agent Mobile App', enabled: true, status: 'live' as const, description: 'On-the-go sales tools', audience: 'Sales Agents' },
    { id: 'investor-dashboard', name: 'Investor Dashboard', enabled: false, status: 'draft' as const, description: 'Portfolio performance views', audience: 'Investors' },
    { id: 'contractor-portal', name: 'Contractor Portal', enabled: true, status: 'live' as const, description: 'Construction milestone access', audience: 'Contractors' },
    { id: 'public-widget', name: 'Public Embed Widget', enabled: true, status: 'live' as const, description: 'Website integration', audience: 'Public' },
    { id: 'stakeholder-reports', name: 'Stakeholder Reports', enabled: false, status: 'draft' as const, description: 'Automated report distribution', audience: 'All Stakeholders' },
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">End-User Experiences</h2>
        <p className="text-sm text-gray-400 mt-1">Configure which interfaces are available to your stakeholders.</p>
      </div>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className={`p-5 rounded-xl border transition-all ${
              exp.enabled
                ? 'bg-gray-800/40 border-gray-700'
                : 'bg-gray-800/20 border-gray-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  exp.enabled ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700 text-gray-500'
                }`}>
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{exp.name}</h4>
                    <StatusBadge status={exp.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{exp.description} · For: {exp.audience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExperiences(experiences.map((e) =>
                    e.id === exp.id ? { ...e, enabled: !e.enabled, status: e.enabled ? 'draft' as const : 'live' as const } : e
                  ))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    exp.enabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      exp.enabled ? 'left-[22px]' : 'left-[2px]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Conditional settings — only visible when enabled */}
            {exp.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-3 gap-4"
              >
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Custom Domain</label>
                  <input
                    placeholder={`${exp.id}.stedaxis.oneaxis.live`}
                    className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Visibility</label>
                  <select className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
                    <option>All authenticated users</option>
                    <option>Specific roles only</option>
                    <option>Public (no auth)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Theme Override</label>
                  <select className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
                    <option>Inherit workspace</option>
                    <option>Light only</option>
                    <option>Dark only</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NOTIFICATION RULES PANEL
   ═══════════════════════════════════════════ */
function NotificationRulesPanel() {
  const [rules] = useState([
    { id: '1', trigger: 'Unit Reserved', channels: ['email', 'slack'], recipients: ['Sales Agent', 'Project Manager'], status: 'live' as const },
    { id: '2', trigger: 'Price Change', channels: ['email'], recipients: ['Admin', 'Project Manager'], status: 'live' as const },
    { id: '3', trigger: 'Document Uploaded', channels: ['slack', 'app'], recipients: ['All Team'], status: 'live' as const },
    { id: '4', trigger: 'Settlement Due (30 days)', channels: ['email', 'whatsapp'], recipients: ['Buyer', 'Sales Agent'], status: 'live' as const },
    { id: '5', trigger: 'Construction Milestone', channels: ['email', 'app'], recipients: ['Buyer', 'Project Manager'], status: 'pending-review' as const },
    { id: '6', trigger: 'AI Insight Generated', channels: ['app'], recipients: ['Project Manager'], status: 'draft' as const },
  ]);

  const channelIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-3 h-3" />,
    slack: <MessageSquare className="w-3 h-3" />,
    app: <Smartphone className="w-3 h-3" />,
    whatsapp: <MessageSquare className="w-3 h-3" />,
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Notification Rules</h2>
          <p className="text-sm text-gray-400 mt-1">Configure when and how stakeholders get notified.</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
          <Zap className="w-3.5 h-3.5 mr-1.5" /> New Rule
        </Button>
      </div>

      <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_180px_80px] gap-4 px-5 py-3 border-b border-gray-700 text-xs text-gray-500 font-medium uppercase">
          <span>Trigger Event</span>
          <span>Channels</span>
          <span>Recipients</span>
          <span>Status</span>
        </div>
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="grid grid-cols-[1fr_140px_180px_80px] gap-4 px-5 py-3 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors items-center"
          >
            <span className="text-sm text-white">{rule.trigger}</span>
            <div className="flex gap-1.5">
              {rule.channels.map((ch) => (
                <span key={ch} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">
                  {channelIcons[ch]} {ch}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">{rule.recipients.join(', ')}</span>
            <StatusBadge status={rule.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
