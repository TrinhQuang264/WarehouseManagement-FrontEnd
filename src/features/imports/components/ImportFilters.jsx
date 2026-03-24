import ReceiptFilters from '../../receipts/components/ReceiptFilters.jsx';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'completed', label: 'Đã nhập kho' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function ImportFilters({
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  selectedStatus,
  setSelectedStatus,
  selectedDateRange,
  setSelectedDateRange,
}) {
  return <ReceiptFilters entities={suppliers} entityLabel="Tất cả nhà cung cấp" entityValue={selectedSupplier} onEntityChange={setSelectedSupplier} entityOptionLabel={(supplier) => supplier.supplierName} statusOptions={STATUS_OPTIONS} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} />;
}
