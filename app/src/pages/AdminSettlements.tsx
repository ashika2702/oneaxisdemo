import SettlementRadar from "@/components/SettlementRadar";
import AdminLayout from "@/components/AdminLayout";

export default function AdminSettlements() {
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <SettlementRadar />
      </div>
    </AdminLayout>
  );
}
