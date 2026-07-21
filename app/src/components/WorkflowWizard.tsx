import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow, ChevronRight, ChevronLeft, CheckCircle2,
  Users, Mail, MessageSquare, FileCheck, Target,
  Zap, Clock, AlertTriangle, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './SettingsHub';

const steps = [
  { id: 'trigger', label: 'Trigger', desc: 'What starts the workflow' },
  { id: 'conditions', label: 'Conditions', desc: 'When it runs' },
  { id: 'actions', label: 'Actions', desc: 'What happens' },
  { id: 'recipients', label: 'Recipients', desc: 'Who gets notified' },
  { id: 'review', label: 'Review', desc: 'Confirm and activate' },
];

const triggerOptions = [
  { id: 'unit-reserved', label: 'Unit Reserved', category: 'Sales', icon: Target },
  { id: 'contract-signed', label: 'Contract Signed', category: 'Sales', icon: FileCheck },
  { id: 'deposit-received', label: 'Deposit Received', category: 'Sales', icon: CheckCircle2 },
  { id: 'milestone-reached', label: 'Construction Milestone', category: 'Project', icon: Clock },
  { id: 'document-uploaded', label: 'Document Uploaded', category: 'Project', icon: FileCheck },
  { id: 'price-changed', label: 'Price Changed', category: 'Sales', icon: AlertTriangle },
  { id: 'risk-detected', label: 'Risk Detected', category: 'Intelligence', icon: AlertTriangle },
  { id: 'settlement-due', label: 'Settlement Due (30d)', category: 'Finance', icon: Clock },
  { id: 'stakeholder-joined', label: 'New Stakeholder Joined', category: 'Platform', icon: Users },
  { id: 'manual', label: 'Manual Trigger', category: 'Platform', icon: Zap },
];

const actionOptions = [
  { id: 'send-email', label: 'Send Email', icon: Mail },
  { id: 'send-slack', label: 'Send Slack Message', icon: MessageSquare },
  { id: 'create-task', label: 'Create Task', icon: FileCheck },
  { id: 'update-crm', label: 'Update CRM Record', icon: Target },
  { id: 'generate-report', label: 'Generate Report', icon: FileCheck },
  { id: 'webhook', label: 'Call Webhook', icon: Zap },
  { id: 'escalate', label: 'Escalate to Manager', icon: AlertTriangle },
  { id: 'delay', label: 'Wait (Delay)', icon: Clock },
];

export default function WorkflowWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<string[]>(['project-manager', 'sales-agent']);
  const [workflowName, setWorkflowName] = useState('');
  const [savedWorkflows, setSavedWorkflows] = useState([
    { id: '1', name: 'New Reservation Alert', trigger: 'Unit Reserved', actions: ['Send Email', 'Update CRM'], status: 'live' as const },
    { id: '2', name: 'Settlement Reminder', trigger: 'Settlement Due (30d)', actions: ['Send Email', 'Send Slack'], status: 'live' as const },
    { id: '3', name: 'Milestone Update', trigger: 'Construction Milestone', actions: ['Generate Report'], status: 'draft' as const },
  ]);

  const toggleAction = (id: string) => {
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleRecipient = (id: string) => {
    setRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const saveWorkflow = () => {
    if (!workflowName || !selectedTrigger) return;
    const trigger = triggerOptions.find((t) => t.id === selectedTrigger);
    setSavedWorkflows([
      ...savedWorkflows,
      {
        id: `w-${Date.now()}`,
        name: workflowName,
        trigger: trigger?.label || selectedTrigger,
        actions: selectedActions.map((a) => actionOptions.find((ao) => ao.id === a)?.label || a),
        status: 'draft' as const,
      },
    ]);
    setCurrentStep(0);
    setSelectedTrigger(null);
    setSelectedActions([]);
    setWorkflowName('');
  };

  const canProceed = () => {
    if (currentStep === 0) return !!selectedTrigger;
    if (currentStep === 2) return selectedActions.length > 0;
    if (currentStep === 3) return recipients.length > 0;
    if (currentStep === 4) return !!workflowName;
    return true;
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Workflow Wizard</h2>
        <p className="text-sm text-gray-400 mt-1">Create automated workflows for your stakeholders step by step.</p>
      </div>

      {/* Saved Workflows */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-blue-400" />
          Active Workflows ({savedWorkflows.length})
        </h3>
        <div className="space-y-2">
          {savedWorkflows.map((wf) => (
            <div key={wf.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusBadge status={wf.status} />
                <span className="text-sm text-white font-medium">{wf.name}</span>
                <span className="text-xs text-gray-500">{wf.trigger} → {wf.actions.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-500 hover:text-white transition-colors">Edit</button>
                <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
        {/* Stepper */}
        <div className="flex items-center px-6 py-4 border-b border-gray-700 bg-gray-800/30">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => idx <= currentStep && setCurrentStep(idx)}
                className={`flex items-center gap-2 transition-all ${
                  idx === currentStep ? 'text-blue-400' : idx < currentStep ? 'text-emerald-400' : 'text-gray-600'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  idx === currentStep ? 'border-blue-400 bg-blue-500/10 text-blue-400' :
                  idx < currentStep ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400' :
                  'border-gray-600 text-gray-600'
                }`}>
                  {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-medium">{step.label}</div>
                  <div className="text-[9px] opacity-70">{step.desc}</div>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight className={`w-4 h-4 mx-2 ${
                  idx < currentStep ? 'text-emerald-400' : 'text-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Trigger */}
            {currentStep === 0 && (
              <motion.div
                key="trigger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Select a Trigger</h3>
                <p className="text-sm text-gray-400">What event starts this workflow?</p>
                <div className="grid grid-cols-2 gap-3">
                  {triggerOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedTrigger(opt.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                          selectedTrigger === opt.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/20'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${selectedTrigger === opt.id ? 'text-blue-400' : 'text-gray-500'}`} />
                        <div>
                          <div className="text-sm text-white font-medium">{opt.label}</div>
                          <div className="text-[10px] text-gray-500">{opt.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Conditions */}
            {currentStep === 1 && (
              <motion.div
                key="conditions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Set Conditions</h3>
                <p className="text-sm text-gray-400">When should this workflow run?</p>
                <div className="space-y-3">
                  {[
                    { id: 'always', label: 'Always — run every time the trigger fires', default: true },
                    { id: 'business-hours', label: 'Only during business hours (9 AM – 6 PM)', default: false },
                    { id: 'weekdays', label: 'Only on weekdays', default: false },
                    { id: 'threshold', label: 'Only if value exceeds threshold', default: false },
                  ].map((cond) => (
                    <label key={cond.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors">
                      <input type="checkbox" defaultChecked={cond.default} className="w-4 h-4 rounded border-gray-600 text-blue-500" />
                      <span className="text-sm text-gray-300">{cond.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Actions */}
            {currentStep === 2 && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Choose Actions</h3>
                <p className="text-sm text-gray-400">What should happen when the trigger fires? Select one or more.</p>
                <div className="grid grid-cols-2 gap-3">
                  {actionOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = selectedActions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleAction(opt.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                          selected
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/20'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'
                        }`}>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <Icon className={`w-5 h-5 ${selected ? 'text-emerald-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${selected ? 'text-white' : 'text-gray-400'}`}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Recipients */}
            {currentStep === 3 && (
              <motion.div
                key="recipients"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Select Recipients</h3>
                <p className="text-sm text-gray-400">Who should be notified when this workflow runs?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'owner', label: 'Workspace Owner', color: 'amber' },
                    { id: 'admin', label: 'Admins', color: 'red' },
                    { id: 'project-manager', label: 'Project Managers', color: 'blue' },
                    { id: 'sales-agent', label: 'Sales Agents', color: 'emerald' },
                    { id: 'buyer', label: 'End-Customer (Buyer)', color: 'purple' },
                    { id: 'external-agent', label: 'External Agents', color: 'cyan' },
                  ].map((rec) => {
                    const selected = recipients.includes(rec.id);
                    return (
                      <button
                        key={rec.id}
                        onClick={() => toggleRecipient(rec.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                          selected
                            ? `border-${rec.color}-500 bg-${rec.color}-500/10`
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/20'
                        }`}
                      >
                        <Users className={`w-5 h-5 ${selected ? `text-${rec.color}-400` : 'text-gray-500'}`} />
                        <span className={`text-sm ${selected ? 'text-white' : 'text-gray-400'}`}>{rec.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 4 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Review & Activate</h3>
                <p className="text-sm text-gray-400">Confirm your workflow configuration.</p>

                <div className="bg-gray-900/50 rounded-xl p-5 space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Workflow Name</label>
                    <input
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="e.g., New Reservation Alert"
                      className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Trigger</label>
                      <div className="mt-1 text-sm text-white">
                        {triggerOptions.find((t) => t.id === selectedTrigger)?.label}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Actions</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedActions.map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                            {actionOptions.find((ao) => ao.id === a)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Recipients</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recipients.map((r) => (
                        <span key={r} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs capitalize">
                          {r.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status="draft" />
                  <span className="text-xs text-gray-500">Will be saved as Draft. Activate after review.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={saveWorkflow}
                disabled={!canProceed()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1" /> Save Workflow
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
