import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminLeads() {
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <h1 className="text-lg font-semibold text-[#F4F1EC]">Leads</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-[#F4F1EC] mb-2">Lead Management</h2>
            <p className="text-sm text-[#8C8278]">Track and manage all leads from first contact to conversion.</p>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
