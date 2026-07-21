import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Upload, Folder, File, Image, FileSpreadsheet, Download, Trash2, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/providers/trpc";

const FILE_ICONS: Record<string, any> = {
  pdf: FileText, image: Image, spreadsheet: FileSpreadsheet, doc: File, default: File,
};

const MOCK_DOCS = [
  { id: "D001", name: "Contract of Sale - Unit 12A.pdf", type: "pdf", project: "Azure Heights", size: "2.4 MB", uploadedBy: "Sarah Kim", uploadedAt: "2025-06-15", folder: "Contracts" },
  { id: "D002", name: "Floor Plan - Level 3.png", type: "image", project: "Azure Heights", size: "4.1 MB", uploadedBy: "James Chen", uploadedAt: "2025-06-14", folder: "Floor Plans" },
  { id: "D003", name: "Pricing Schedule Q3.xlsx", type: "spreadsheet", project: "Marina View", size: "156 KB", uploadedBy: "David Park", uploadedAt: "2025-06-12", folder: "Pricing" },
  { id: "D004", name: "DA Approval Letter.pdf", type: "pdf", project: "Azure Heights", size: "1.8 MB", uploadedBy: "Lisa Wang", uploadedAt: "2025-06-10", folder: "Approvals" },
  { id: "D005", name: "Building Specification.pdf", type: "pdf", project: "Golden Gate", size: "5.2 MB", uploadedBy: "Emma Watson", uploadedAt: "2025-06-08", folder: "Specifications" },
  { id: "D006", name: "Marketing Brochure v2.pdf", type: "pdf", project: "Azure Heights", size: "8.7 MB", uploadedBy: "Michael Liu", uploadedAt: "2025-06-05", folder: "Marketing" },
];

const FOLDERS = ["All", "Contracts", "Floor Plans", "Pricing", "Approvals", "Specifications", "Marketing"];

export default function DocumentVault() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const projectsQuery = trpc.project.list.useQuery({});

  const filtered = MOCK_DOCS.filter(d => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolder === "All" || d.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 h-[60px] flex-shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-white/90">Document Vault</h1>
              <p className="text-[10px] text-white/25">{filtered.length} documents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 w-48 bg-white/[0.02] border-white/[0.05] text-white/70 text-[12px]" />
            </div>
            <button className="flex items-center gap-2 px-3 h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/60 text-[12px] hover:bg-white/[0.05] transition-all">
              <Upload className="w-3.5 h-3.5" />Upload
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Folders */}
          <div className="w-48 border-r border-white/[0.04] py-3 flex-shrink-0">
            {FOLDERS.map(f => (
              <button key={f} onClick={() => setActiveFolder(f)}
                className={`w-full flex items-center gap-2 px-4 h-8 text-[12px] transition-all ${activeFolder === f ? "text-white/80 bg-white/[0.04]" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"}`}>
                <Folder className="w-3.5 h-3.5" />{f}
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
            <div className="rounded-xl border border-white/[0.04] overflow-hidden">
              {filtered.map((doc, i) => {
                const Icon = FILE_ICONS[doc.type] || FILE_ICONS.default;
                return (
                  <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-white/80 truncate">{doc.name}</p>
                      <p className="text-[10px] text-white/25">{doc.project} · {doc.folder}</p>
                    </div>
                    <span className="text-[10px] text-white/20 flex-shrink-0">{doc.size}</span>
                    <span className="text-[10px] text-white/20 flex-shrink-0 w-24">{doc.uploadedBy}</span>
                    <span className="text-[10px] text-white/15 flex-shrink-0 w-20">{doc.uploadedAt}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button className="w-7 h-7 rounded hover:bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/50"><Download className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
