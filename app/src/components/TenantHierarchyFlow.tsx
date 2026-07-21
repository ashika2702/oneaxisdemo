import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, User, UserCheck, TrendingUp, HardHat,
  ChevronDown, ChevronUp, Shield, Globe, Eye,
  ArrowRight, Lock, Briefcase, Home,
  FileText,
  CheckCircle2, Zap, Link2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './SettingsHub';

interface HierarchyNode {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  children?: HierarchyNode[];
  permissions?: string[];
  dataAccess?: string[];
}

const hierarchyData: HierarchyNode[] = [
  {
    id: 'tenant',
    label: 'Corporate Tenant',
    subtitle: 'Stedaxis Development',
    icon: Building2,
    color: 'blue',
    permissions: ['Full platform control', 'Workflow configuration', 'User management', 'Billing & plans'],
    dataAccess: ['All project data', 'Financial reports', 'Audit logs', 'AI insights'],
    children: [
      {
        id: 'owner',
        label: 'Workspace Owner',
        subtitle: 'Alex Morgan',
        icon: Shield,
        color: 'amber',
        permissions: ['Everything'],
        dataAccess: ['Unrestricted'],
      },
      {
        id: 'admin',
        label: 'Admin Team',
        subtitle: '3 members',
        icon: Users,
        color: 'red',
        permissions: ['Manage users', 'Configure workflows', 'View all data', 'Manage integrations'],
        dataAccess: ['All project data', 'Financials', 'Reports', 'Audit logs'],
      },
      {
        id: 'project-mgr',
        label: 'Project Managers',
        subtitle: '2 members',
        icon: Briefcase,
        color: 'blue',
        permissions: ['Manage projects', 'Edit 3D models', 'Run reports', 'Configure views'],
        dataAccess: ['Project data', 'Unit inventory', 'Analytics', 'Documents'],
      },
    ],
  },
  {
    id: 'stakeholder',
    label: 'External Stakeholders',
    subtitle: 'Connected partners & agents',
    icon: Globe,
    color: 'purple',
    permissions: ['Access configured portals', 'Receive notifications', 'Submit data'],
    dataAccess: ['Role-scoped data only'],
    children: [
      {
        id: 'sales-agent',
        label: 'Sales Agents',
        subtitle: '5 external agents',
        icon: UserCheck,
        color: 'emerald',
        permissions: ['View pricing', 'Reserve units', 'Run comparisons', 'Chat with buyers'],
        dataAccess: ['Unit pricing', 'Availability', 'Marketing materials', 'Buyer inquiries'],
      },
      {
        id: 'contractor',
        label: 'Contractors',
        subtitle: '3 firms',
        icon: HardHat,
        color: 'amber',
        permissions: ['View milestones', 'Upload progress photos', 'Submit variations'],
        dataAccess: ['Construction timeline', 'Site documents', 'Milestone tracker', 'Safety reports'],
      },
      {
        id: 'investor',
        label: 'Investors',
        subtitle: '8 portfolio investors',
        icon: TrendingUp,
        color: 'cyan',
        permissions: ['View financials', 'Download reports', 'Set alert thresholds'],
        dataAccess: ['Financial projections', 'Sales velocity', 'Market data', 'ROI analysis'],
      },
    ],
  },
  {
    id: 'enduser',
    label: 'End-Customers',
    subtitle: 'Buyers & public visitors',
    icon: Home,
    color: 'pink',
    permissions: ['Browse units', 'Make reservations', 'Track their purchase'],
    dataAccess: ['Their unit details', 'Public project info', 'Timeline (filtered)'],
    children: [
      {
        id: 'buyer',
        label: 'Active Buyers',
        subtitle: '31 buyers with reservations',
        icon: User,
        color: 'purple',
        permissions: ['View their unit', 'Track construction', 'Upload documents', 'Message team'],
        dataAccess: ['Own unit details', 'Construction progress', 'Their documents', 'Messages'],
      },
      {
        id: 'prospect',
        label: 'Prospects',
        subtitle: 'Public website visitors',
        icon: Eye,
        color: 'gray',
        permissions: ['Browse public listings', 'Use widget', 'Request info'],
        dataAccess: ['Public unit info', 'Project overview', 'Brochure download'],
      },
    ],
  },
];

function FlowNode({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const Icon = node.icon;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-700/50 pl-6' : ''}`}>
      <motion.div
        layout
        className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
          expanded
            ? `bg-${node.color}-500/5 border-${node.color}-500/30`
            : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-${node.color}-500/10 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 text-${node.color}-400`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{node.label}</h4>
              {depth === 0 && <StatusBadge status="live" />}
            </div>
            <p className="text-xs text-gray-500">{node.subtitle}</p>
          </div>
          {hasChildren && (
            <button className="text-gray-500 hover:text-white transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Permissions & Data Access */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-gray-700/50"
            >
              <div className="grid grid-cols-2 gap-4">
                {node.permissions && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Permissions
                    </div>
                    <div className="space-y-1">
                      {node.permissions.map((p) => (
                        <div key={p} className="flex items-center gap-1.5 text-xs text-gray-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {node.dataAccess && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Data Access
                    </div>
                    <div className="space-y-1">
                      {node.dataAccess.map((d) => (
                        <div key={d} className="flex items-center gap-1.5 text-xs text-gray-300">
                          <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-3 relative"
          >
            {/* Connector line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700/50 -ml-[1px]" />
            {node.children!.map((child) => (
              <FlowNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TenantHierarchyFlow() {
  const [showDataFlow, setShowDataFlow] = useState(false);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Hierarchy & Data Flow</h2>
        <p className="text-sm text-gray-400 mt-1">
          Visualize how data flows from your organization through stakeholders to end-customers.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-center gap-4 py-4">
        {[
          { label: 'Tenant', icon: Building2, color: 'blue', count: '1 org' },
          { label: 'Stakeholders', icon: Globe, color: 'purple', count: '16 users' },
          { label: 'End-Users', icon: Home, color: 'emerald', count: '200+ users' },
        ].map((tier, i) => (
          <div key={tier.label} className="flex items-center gap-4">
            <div className={`bg-${tier.color}-500/10 border border-${tier.color}-500/30 rounded-xl p-4 text-center min-w-[140px]`}>
              <tier.icon className={`w-8 h-8 text-${tier.color}-400 mx-auto mb-2`} />
              <div className="text-sm font-semibold text-white">{tier.label}</div>
              <div className="text-[10px] text-gray-500">{tier.count}</div>
            </div>
            {i < 2 && (
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-5 h-5 text-gray-600" />
                <Lock className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Tree */}
      <div className="space-y-4">
        {hierarchyData.map((node) => (
          <FlowNode key={node.id} node={node} depth={0} />
        ))}
      </div>

      {/* Data Flow Visualization */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Data Flow Rules
          </h3>
          <button
            onClick={() => setShowDataFlow(!showDataFlow)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {showDataFlow ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { from: 'Tenant', to: 'Stakeholder', type: 'Push', data: 'Project config, workflows, branding', icon: ArrowRight },
            { from: 'Stakeholder', to: 'End-User', type: 'Filtered', data: 'Role-scoped views, notifications', icon: ArrowRight },
            { from: 'End-User', to: 'Tenant', type: 'Pull', data: 'Inquiries, reservations, feedback', icon: ArrowRight },
          ].map((flow) => (
            <div key={flow.from + flow.to} className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <flow.icon className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] text-gray-500 uppercase">{flow.type}</span>
              </div>
              <div className="text-xs text-gray-300 mb-1">{flow.from} → {flow.to}</div>
              <div className="text-[10px] text-gray-500">{flow.data}</div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showDataFlow && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-700/50"
            >
              <div className="space-y-2">
                {[
                  { rule: 'Tenant settings override stakeholder preferences', scope: 'Global', impact: 'High' },
                  { rule: 'Stakeholder visibility rules filter end-user data', scope: 'Per-role', impact: 'High' },
                  { rule: 'End-user actions trigger stakeholder notifications', scope: 'Event-driven', impact: 'Medium' },
                  { rule: 'Audit log captures all data access across tiers', scope: 'All', impact: 'High' },
                  { rule: 'Workflow automations can span all three tiers', scope: 'Configurable', impact: 'Medium' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg">
                    <Link2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-300 flex-1">{item.rule}</span>
                    <Badge className="bg-gray-700/50 text-gray-400 text-[9px]">{item.scope}</Badge>
                    <Badge className={`text-[9px] ${item.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {item.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
