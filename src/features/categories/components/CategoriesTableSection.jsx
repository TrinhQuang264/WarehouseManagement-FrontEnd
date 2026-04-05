import DataTableCard from "../../../components/ui/DataTableCard";
import CategoryTable from "./CategoryTable";
import BulkActionBar from "../../../components/ui/BulkActionBar";
import { Trash2 } from "lucide-react";

export default function CategoriesTableSection({
  categories,
  loading,
  onEdit,
  onDelete,
  searchTerm,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onBulkDelete,
}) {
  return (
    <DataTableCard className="min-h-[500px] flex flex-col relative">
      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        searchTerm={searchTerm}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
      />

      <BulkActionBar
        selectedCount={selectedIds.length}
        isVisible={selectedIds.length > 0}
        onClearSelection={() => toggleSelectAll()}
        actions={[
          {
            label: "Xóa vào thùng rác",
            icon: <Trash2 size={16} />,
            onClick: onBulkDelete,
            variant: "danger",
          },
        ]}
      />
    </DataTableCard>
  );
}
