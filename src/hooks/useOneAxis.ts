/* ═══════════════════════════════════════════
   ONEAXIS tRPC Frontend Hooks
   Type-safe data fetching with Zustand + tRPC
   ═══════════════════════════════════════════ */

import { trpc } from '@/providers/trpc';

// ─── Projects ───
export function useProjects(status?: string, type?: string) {
  return trpc.project.list.useQuery({ status, type });
}

export function useProject(id: number) {
  return trpc.project.getById.useQuery({ id });
}

export function useCreateProject() {
  return trpc.project.create.useMutation();
}

export function useUpdateProject() {
  return trpc.project.update.useMutation();
}

// ─── Units ───
export function useUnits(projectId: number) {
  return trpc.unit.list.useQuery({ projectId });
}

export function useUpdateUnit() {
  return trpc.unit.update.useMutation();
}

// ─── Leads (D3: progressive capture) ───
export function useLeads(projectId?: number, stage?: string, limit?: number) {
  return trpc.lead.list.useQuery({ projectId, stage, limit });
}

// ─── Buyers (post-contract only) ───
export function useBuyers(projectId: number, status?: string) {
  return trpc.buyer.list.useQuery({ projectId, status });
}

export function useCreateBuyer() {
  return trpc.buyer.create.useMutation();
}

// ─── Analytics ───
export function useDashboard(limit?: number) {
  return trpc.analytics.dashboard.useQuery({ limit });
}

export function useProjectPulse(projectId: number) {
  return trpc.analytics.projectPulse.useQuery({ projectId });
}

// ─── Workflows ───
export function useWorkflows(projectId?: number) {
  return trpc.workflow.list.useQuery({ projectId });
}

export function useCreateWorkflow() {
  return trpc.workflow.create.useMutation();
}

// ─── Money formatting (D6) ───
export function formatMoney(amount: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
