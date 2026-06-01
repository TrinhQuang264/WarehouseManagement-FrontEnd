import ReceiptTable from '../../receipts/components/ReceiptTable.jsx';

export default function ExportTable({ receipts, onEdit, onViewDetail, onDelete, onSubmit }) {
  return (
    <ReceiptTable
      receipts={receipts}
      onEdit={onEdit}
      onViewDetail={onViewDetail}
      onDelete={onDelete}
      onSubmit={onSubmit}
      partyColumnLabel="Khách hàng"
      partyNameKey="customerName"
      dateColumnLabel="Ngày xuất"
      emptyMessage="Không có phiếu xuất phù hợp với bộ lọc hiện tại."
    />
  );
}
