import ConstructionPhasing from "@/components/ConstructionPhasing";
import AdminLayout from "@/components/AdminLayout";

export default function AdminPhasing() {
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ConstructionPhasing />
      </div>
    </AdminLayout>
  );
}
