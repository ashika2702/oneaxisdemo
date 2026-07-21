import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════
   LOADING SKELETON — Shimmer effect
   ═══════════════════════════════════════════ */

export function SkeletonCard() {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-700" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-20 bg-gray-700/50 rounded-lg" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="h-3 bg-gray-700 rounded w-20 mb-3" />
      <div className="h-8 bg-gray-700 rounded w-16" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden animate-pulse">
      <div className="h-10 bg-gray-700/50" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 bg-gray-800/30 border-t border-gray-700/50" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-32 mb-4" />
      <div className="h-48 bg-gray-700/30 rounded-lg flex items-end gap-2 p-4">
        {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-700 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
      </div>
      <SkeletonTable />
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
