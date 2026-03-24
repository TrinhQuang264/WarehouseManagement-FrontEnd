import ReceiptTable from '../../receipts/components/ReceiptTable.jsx';

export default function ImportTable({ receipts, onEdit, onViewDetail, onDelete }) {
  return (
    <ReceiptTable
      receipts={receipts}
      onEdit={onEdit}
      onViewDetail={onViewDetail}
      onDelete={onDelete}
      partyColumnLabel="Nhà cung cấp"
      partyNameKey="supplierName"
      dateColumnLabel="Ngày nhập"
      emptyMessage="Không có phiếu nhập phù hợp với bộ lọc hiện tại."
    />
  );
}
