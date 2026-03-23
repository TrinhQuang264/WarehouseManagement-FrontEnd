import ReceiptFilters from '../../receipts/components/ReceiptFilters.jsx';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'completed', label: 'Đã xuất kho' },
  { value: 'pending', label: 'Chờ duyệt xuất' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function ExportFilters({ customers, selectedCustomer, setSelectedCustomer, selectedStatus, setSelectedStatus, selectedDateRange, setSelectedDateRange }) {
  return <ReceiptFilters entities={customers} entityLabel="Tất cả khách hàng" entityValue={selectedCustomer} onEntityChange={setSelectedCustomer} entityOptionLabel={(customer) => customer.fullName} statusOptions={STATUS_OPTIONS} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} />;
}
