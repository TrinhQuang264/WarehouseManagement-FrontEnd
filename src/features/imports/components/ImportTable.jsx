import ReceiptTable from "../../receipts/components/ReceiptTable.jsx";

export default function ImportTable({
  receipts,
  onEdit,
  onViewDetail,
  onDelete,
  onSubmit,
  showDelete,
  showStatus,
  isAdmin,
}) {
  return (
    <ReceiptTable
      receipts={receipts}
      onEdit={onEdit}
      onViewDetail={onViewDetail}
      onDelete={onDelete}
      onSubmit={onSubmit}
      partyColumnLabel="Nhà cung cấp"
      partyNameKey="supplierName"
      dateColumnLabel="Ngày nhập"
      emptyMessage="Không có phiếu nhập phù hợp với bộ lọc hiện tại."
      showDelete={showDelete}
      showStatus={showStatus}
      isAdmin={isAdmin}
    />
  );
}
