import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Calendar, Database, CheckCircle,
  AlertTriangle, DollarSign, FileText, X, Settings,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'unit-sold' | 'price-change' | 'approval-needed' | 'document-ready' | 'deadline' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/* ────────────────────────────────────────────────
   NOTIFICATION CENTER — Lock-in Feature
   Shows email notifications, calendar reminders,
   CRM sync status, and system alerts.
   ──────────────────────────────────────────── */

const demoNotifications: Notification[] = [
  { id: 'n1', type: 'unit-sold', title: 'Unit 12B Sold', message: 'Unit 12B (2-BR, Marina View) has been marked as sold by Ahmed Al-Rashid.', read: false, createdAt: '2 min ago' },
  { id: 'n2', type: 'approval-needed', title: 'Pricing Change Pending Approval', message: 'Floor premium increase from 2% to 3% requires your approval.', read: false, createdAt: '15 min ago' },
  { id: 'n3', type: 'deadline', title: 'Handoff Meeting Tomorrow', message: 'Sales → Design handoff meeting scheduled for June 22, 10:00 AM GST.', read: false, createdAt: '1 hr ago' },
  { id: 'n4', type: 'document-ready', title: 'Brochure Export Complete', message: 'Azure Heights Tower brochure has been generated and is ready for download.', read: true, createdAt: '3 hrs ago' },
  { id: 'n5', type: 'milestone', title: '50% Sales Milestone', message: 'Congratulations! 24 of 48 units have been sold. Project is 50% complete.', read: true, createdAt: '1 day ago' },
];

const typeIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'unit-sold': { icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'price-change': { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'approval-needed': { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'document-ready': { icon: <FileText className="w-3.5 h-3.5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'deadline': { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-red-400', bg: 'bg-red-500/10' },
  'milestone': { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

// CRM Sync Status Indicator
function CRMSyncStatus() {
  const [synced, setSynced] = useState(true);
  return (
    <button
      onClick={() => setSynced(!synced)}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all"
      title="CRM Sync Status"
    >
      <Database className={`w-3 h-3 ${synced ? 'text-emerald-400' : 'text-amber-400'}`} />
      <span className="text-[10px] text-gray-400">{synced ? 'HubSpot' : 'Syncing...'}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${synced ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
    </button>
  );
}

// Calendar Integration Indicator
function CalendarSync() {
  const [events] = useState(2);
  return (
    <button
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all"
      title="Upcoming Events"
    >
      <Calendar className="w-3 h-3 text-blue-400" />
      <span className="text-[10px] text-gray-400">{events} today</span>
    </button>
  );
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-800">
                <h4 className="text-white text-sm font-medium">Notifications</h4>
                <div className="flex gap-1">
                  <button onClick={markAllRead} className="text-gray-500 hover:text-gray-300 p-1" title="Mark all read">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'unread' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-xs">No notifications</div>
                )}
                {filtered.map((n) => {
                  const t = typeIcons[n.type];
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex gap-3 p-3 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${t.bg} ${t.color} flex items-center justify-center flex-shrink-0`}>
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white text-xs font-medium truncate">{n.title}</span>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-gray-600 text-[10px] mt-1 block">{n.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-gray-800">
                <div className="flex items-center justify-between gap-2">
                  <CRMSyncStatus />
                  <CalendarSync />
                  <button className="p-1.5 text-gray-500 hover:text-gray-300" title="Settings">
                    <Settings className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
