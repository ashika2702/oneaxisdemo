import AlgorithmPanel from "@/components/AlgorithmPanel";
import AdminLayout from "@/components/AdminLayout";

export default function AdminAlgorithms() {
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AlgorithmPanel />
      </div>
    </AdminLayout>
  );
}
