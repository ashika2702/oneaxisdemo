import { useState } from 'react';
import {
  Shield, Check, X, Eye, Settings,
  Info, Filter
} from 'lucide-react';

type Permission = 'full' | 'read' | 'none';

interface MatrixRow {
  feature: string;
  category: string;
  description: string;
  owner: Permission;
  admin: Permission;
  projectManager: Permission;
  salesAgent: Permission;
  designer: Permission;
  viewer: Permission;
}

const features: MatrixRow[] = [
  // PROJECT DATA
  { feature: 'View 3D Models', category: 'Visualisation', description: 'Interactive 3D project viewer', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'full', designer: 'full', viewer: 'read' },
  { feature: 'Edit 3D Models', category: 'Visualisation', description: 'Modify model properties', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'full', viewer: 'none' },
  { feature: 'Upload Files', category: 'Visualisation', description: 'CAD, PDF, IFC uploads', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'full', viewer: 'none' },
  { feature: 'Stack Plan View', category: 'Visualisation', description: 'Floor-by-floor inventory', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'full', designer: 'read', viewer: 'read' },
  { feature: 'Sunlight Analysis', category: 'Visualisation', description: 'Solar/shadow simulation', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'full', viewer: 'read' },
  { feature: 'City Digital Twin', category: 'Visualisation', description: 'Traffic, weather, infrastructure', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'read', viewer: 'none' },
  // SALES
  { feature: 'Unit Pricing', category: 'Sales', description: 'View and edit unit prices', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'full', designer: 'none', viewer: 'none' },
  { feature: 'What-If Simulator', category: 'Sales', description: 'Pricing scenario modeling', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'none', viewer: 'none' },
  { feature: 'Reserve Units', category: 'Sales', description: 'Create reservations', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'full', designer: 'none', viewer: 'none' },
  { feature: 'Contracts & E-Sign', category: 'Sales', description: 'Generate and manage contracts', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'full', designer: 'none', viewer: 'none' },
  { feature: 'Concierge Chat', category: 'Sales', description: 'AI sales assistant config', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'read', designer: 'none', viewer: 'none' },
  // INTELLIGENCE
  { feature: 'Pulse Dashboard', category: 'Intelligence', description: 'Attention & conversion analytics', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'none', viewer: 'none' },
  { feature: 'Revenue at Risk', category: 'Intelligence', description: 'Buyer risk scoring', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'none', viewer: 'none' },
  { feature: 'Algorithm Panel', category: 'Intelligence', description: 'ML model transparency', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'none', viewer: 'none' },
  { feature: 'Data Flywheel', category: 'Intelligence', description: 'Compounding data insights', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'none', viewer: 'none' },
  // REPORTS
  { feature: 'Generate Reports', category: 'Reports', description: 'Stakeholder report creation', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'read', viewer: 'read' },
  { feature: 'Financial Projections', category: 'Reports', description: 'IRR, NPV, ROI analysis', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'none', viewer: 'none' },
  { feature: 'Pitch Deck Builder', category: 'Reports', description: 'Auto-generated presentations', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'full', viewer: 'none' },
  // PLATFORM
  { feature: 'Org Settings', category: 'Platform', description: 'Workspace configuration', owner: 'full', admin: 'full', projectManager: 'none', salesAgent: 'none', designer: 'none', viewer: 'none' },
  { feature: 'Approval Workflows', category: 'Platform', description: 'Publish approval chains', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'none', designer: 'none', viewer: 'none' },
  { feature: 'Model Versioning', category: 'Platform', description: 'Version control for projects', owner: 'full', admin: 'full', projectManager: 'full', salesAgent: 'read', designer: 'read', viewer: 'read' },
  { feature: 'Audit Log', category: 'Platform', description: 'Activity tracking', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'none', viewer: 'none' },
  { feature: 'Invite Members', category: 'Platform', description: 'Team invitation management', owner: 'full', admin: 'full', projectManager: 'read', salesAgent: 'none', designer: 'none', viewer: 'none' },
];

const roles = [
  { key: 'owner', label: 'Owner', color: 'amber', desc: 'Full control' },
  { key: 'admin', label: 'Admin', color: 'red', desc: 'Manage tenant' },
  { key: 'projectManager', label: 'Project Mgr', color: 'blue', desc: 'Manage projects' },
  { key: 'salesAgent', label: 'Sales Agent', color: 'emerald', desc: 'Sell units' },
  { key: 'designer', label: 'Designer', color: 'purple', desc: 'Visual design' },
  { key: 'viewer', label: 'Viewer', color: 'gray', desc: 'Read-only' },
] as const;

function PermissionCell({ value, onChange }: { value: Permission; onChange?: (v: Permission) => void }) {
  const cycle = () => {
    if (!onChange) return;
    const order: Permission[] = ['none', 'read', 'full'];
    const next = order[(order.indexOf(value) + 1) % order.length];
    onChange(next);
  };

  const config = {
    full: { bg: 'bg-emerald-500/20 text-emerald-400', icon: Check, label: 'Full' },
    read: { bg: 'bg-blue-500/20 text-blue-400', icon: Eye, label: 'Read' },
    none: { bg: 'bg-gray-700/50 text-gray-600', icon: X, label: '—' },
  };
  const c = config[value];
  const Icon = c.icon;

  return (
    <button
      onClick={cycle}
      disabled={!onChange}
      className={`w-full py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${c.bg} ${
        onChange ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
      }`}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </button>
  );
}

export default function PermissionsMatrix() {
  const [matrix, setMatrix] = useState(features);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editable, setEditable] = useState(false);

  const categories = [...new Set(features.map((f) => f.category))];
  const filtered = filterCategory === 'all' ? matrix : matrix.filter((f) => f.category === filterCategory);

  const updatePermission = (idx: number, role: string, value: Permission) => {
    setMatrix(matrix.map((row, i) => i === idx ? { ...row, [role]: value } : row));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Permission Matrix</h2>
          <p className="text-sm text-gray-400 mt-1">
            Feature access by role. Click any cell to cycle through Full → Read → None.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditable(!editable)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              editable ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            {editable ? 'Done Editing' : 'Edit Matrix'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-gray-500" />
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-2.5 py-1 rounded-md text-xs transition-all ${
            filterCategory === 'all' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-xs transition-all ${
              filterCategory === cat ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Matrix */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-4 py-3 border-b border-gray-700 bg-gray-800/60">
          <div className="text-xs text-gray-500 font-medium uppercase flex items-center gap-1">
            <Shield className="w-3 h-3" /> Feature
          </div>
          {roles.map((role) => (
            <div key={role.key} className="text-center">
              <div className={`text-[10px] font-semibold text-${role.color}-400 uppercase`}>{role.label}</div>
              <div className="text-[9px] text-gray-600">{role.desc}</div>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {filtered.map((row) => (
          <div
            key={row.feature}
            className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-4 py-2 border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors items-center"
          >
            <div>
              <div className="text-sm text-white font-medium">{row.feature}</div>
              <div className="text-[10px] text-gray-500">{row.description}</div>
            </div>
            {roles.map((role) => (
              <div key={role.key} className="px-1">
                <PermissionCell
                  value={row[role.key] as Permission}
                  onChange={editable ? (v) => updatePermission(matrix.indexOf(row), role.key, v) : undefined}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-semibold">Full</span>
          <span>Read + Write access</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-semibold">Read</span>
          <span>View only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-gray-700/50 text-gray-600 rounded text-[10px] font-semibold">—</span>
          <span>No access</span>
        </div>
        {editable && (
          <div className="flex items-center gap-1.5 text-amber-400">
            <Info className="w-3.5 h-3.5" />
            <span>Click any cell to cycle permission</span>
          </div>
        )}
      </div>
    </div>
  );
}
