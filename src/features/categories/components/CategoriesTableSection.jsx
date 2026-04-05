import DataTableCard from "../../../components/ui/DataTableCard";
import CategoryTable from "./CategoryTable";

export default function CategoriesTableSection({
  categories,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  return (
    <DataTableCard className="min-h-[500px] flex flex-col">
      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        searchTerm={searchTerm}
      />
    </DataTableCard>
  );
}
