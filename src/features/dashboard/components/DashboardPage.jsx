import Loading from "../../../components/ui/Loading";
import { useDashboard } from "../hooks/useDashboard.jsx";
import DashboardStats from "./DashboardStats";
import DashboardMainChart from "./DashboardMainChart";
import DashboardSubCharts from "./DashboardSubCharts";
import DashboardTables from "./DashboardTables";
import "../styles/Dashboard.css";

export default function DashboardPage() {
  const {
    stats,
    loading,
    chartData,
    allocation,
    lineChartData,
    restockProducts,
    topProducts,
    selectedYear,
    setSelectedYear,
    availableYears,
  } = useDashboard();

  if (loading || !stats)
    return <Loading text="Đang tải dữ liệu dashboard..." />;

  return (
    <div className="p-2 bg-slate-50 ">
      <div className="max-w-[1920px] mx-auto">
        {/* 1. Summary Cards */}
        <DashboardStats stats={stats} />

        {/* 2 & 3. Charts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
          <div className="lg:col-span-8 h-full">
            <div className="h-full">
              <DashboardMainChart
                data={chartData}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                availableYears={availableYears}
              />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col h-full gap-4">
            <div className="flex-1">
              <DashboardSubCharts
                allocationData={allocation}
                lineChartData={lineChartData}
              />
            </div>
          </div>
        </div>

        {/* 4. Tables (Restock + Top Selling) */}
        <DashboardTables
          restockProducts={restockProducts}
          topProducts={topProducts}
        />
      </div>
    </div>
  );
}
