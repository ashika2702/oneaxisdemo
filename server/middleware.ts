import { eq, and } from "drizzle-orm";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { getDb } from "./queries/connection";
import { orgMembers } from "@db/schema";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

/* ─── Auth middleware ─── */
const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const authedQuery = t.procedure.use(requireAuth);

/* ─── A1: Org-scoped procedure ───
   Validates the user is an active member of the requested org.
   The orgId comes from input but is VERIFIED against org_members.
   Never trust orgId from client without this check.            */
const requireOrgMembership = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }

  // Input must include orgId — comes from Zod-parsed input
  // tRPC v11: access rawInput via cast (not on public type)
  const input = (opts as any).rawInput as Record<string, unknown> | undefined;
  const orgId = input?.orgId as number | undefined;

  if (!orgId || typeof orgId !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "orgId is required" });
  }

  const db = getDb();
  const membership = await db.query.orgMembers?.findFirst({
    where: and(
      eq(orgMembers.orgId, orgId),
      eq(orgMembers.userId, ctx.user.id),
      eq(orgMembers.isActive, true),
    ),
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You are not a member of organisation ${orgId}`,
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      org: { id: orgId, role: membership.workspaceRole },
    },
  });
});

export const orgProcedure = authedQuery.use(requireOrgMembership);

/* ─── Workspace role gate ───
   Use after orgProcedure. Checks workspaceRole from verified context. */
export type WorkspaceRole = "owner" | "admin" | "project_manager" | "sales_agent" | "designer" | "viewer";

export function requireWorkspaceRole(allowedRoles: WorkspaceRole[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    const orgCtx = ctx as TrpcContext & { org?: { id: number; role: string } };

    if (!orgCtx.org) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Organisation context missing" });
    }

    if (!allowedRoles.includes(orgCtx.org.role as WorkspaceRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Requires one of: ${allowedRoles.join(", ")}. You have: ${orgCtx.org.role}`,
      });
    }

    return next({ ctx: orgCtx });
  });
}

/* ─── Write-protected procedure (admin + PM) ─── */
export const writeProcedure = orgProcedure.use(
  requireWorkspaceRole(["owner", "admin", "project_manager"]),
);

/* ─── Sales procedure (sales agents can write leads/reservations) ─── */
export const salesProcedure = orgProcedure.use(
  requireWorkspaceRole(["owner", "admin", "project_manager", "sales_agent"]),
);

/* ─── Legacy adminQuery (kept for auth-router compat) ─── */
const legacyRequireRole = (role: string) =>
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient role" });
    }
    return next({ ctx });
  });

export const adminQuery = authedQuery.use(legacyRequireRole("admin"));
