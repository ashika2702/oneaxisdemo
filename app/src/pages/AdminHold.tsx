import HOLDSuite from "@/components/HOLDSuite";
import AdminLayout from "@/components/AdminLayout";

export default function AdminHold() {
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <HOLDSuite />
      </div>
    </AdminLayout>
  );
}
