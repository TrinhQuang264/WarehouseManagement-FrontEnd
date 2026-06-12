import { useState, useEffect } from 'react';
import productsService from '../../products/api/productsService';
import purchasesService from '../../imports/api/purchasesService';
import categoryService from '../../categories/api/categoriesService';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export function useDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);
  
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [restockProducts, setRestockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch all APIs in parallel
        const [productsRes, purchasesRes, categoriesRes] = await Promise.all([
          productsService.getAll().catch(() => []),
          purchasesService.getAll().catch(() => []),
          categoryService.getAll().catch(() => []),
        ]);

        // Trích xuất dữ liệu mảng an toàn
        const products = Array.isArray(productsRes?.data) ? productsRes.data : Array.isArray(productsRes) ? productsRes : [];
        const purchases = Array.isArray(purchasesRes?.data) ? purchasesRes.data : Array.isArray(purchasesRes) ? purchasesRes : [];
        const categories = Array.isArray(categoriesRes?.data) ? categoriesRes.data : Array.isArray(categoriesRes) ? categoriesRes : [];

        // 1. STATS (4 Cards)
        const totalProducts = products.length;
        let totalInventory = 0;
        let lowStockCount = 0;
        let inventoryValue = 0;

        products.forEach(p => {
          const qty = p.quantity || p.initialStock || 0;
          const price = p.sellingPrice || p.price || 0;
          totalInventory += qty;
          inventoryValue += qty * price;
          if (qty < 10) lowStockCount += 1;
        });

        setStats({
          totalProducts,
          totalInventory,
          lowStockCount,
          inventoryValue
        });

        // Tự động tìm các năm có dữ liệu
        const yearsSet = new Set([currentYear]);
        purchases.forEach(p => {
          const dateStr = p.receiptDate || p.createDate || p.purchaseDate || p.createdAt;
          if (dateStr) {
            yearsSet.add(new Date(dateStr).getFullYear());
          }
        });
        const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
        setAvailableYears(sortedYears);

        // Đảm bảo selectedYear hợp lệ
        const yearToUse = sortedYears.includes(selectedYear) ? selectedYear : currentYear;
        if (!sortedYears.includes(selectedYear)) {
            setSelectedYear(currentYear);
        }

        // 2. MAIN CHART (12 Months Bar Chart)
        const months = Array.from({ length: 12 }, (_, i) => ({
          name: `Th.${i + 1}`,
          import: 0,
          export: 0
        }));

        purchases.forEach(p => {
          const dateStr = p.receiptDate || p.createDate || p.purchaseDate || p.createdAt;
          if (!dateStr) return;
          const d = new Date(dateStr);
          if (d.getFullYear() === yearToUse) {
            const m = d.getMonth(); // 0-11
            const type = Number(p.type || p.Type);
            const totalQty = (p.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            if (type === 1) { // Import
              months[m].import += totalQty;
            } else if (type === 2) { // Export
              months[m].export += totalQty;
            }
          }
        });
        setChartData(months);

        // 3. PIE CHART (Tồn kho theo danh mục)
        const categoryMap = {};
        products.forEach(p => {
          const catId = p.categoryId;
          const qty = p.quantity || p.initialStock || 0;
          if (!categoryMap[catId]) {
            categoryMap[catId] = 0;
          }
          categoryMap[catId] += qty;
        });

        const categoryArray = Object.keys(categoryMap).map(catId => {
          const cat = categories.find(c => String(c.id) === String(catId));
          return {
            name: cat ? cat.name : 'Khác',
            value: categoryMap[catId]
          };
        }).sort((a, b) => b.value - a.value);

        // Map colors and calc percentage
        const totalPie = categoryArray.reduce((sum, item) => sum + item.value, 0);
        const topCats = categoryArray.slice(0, 4).map((c, i) => ({
          name: c.name,
          value: totalPie > 0 ? Math.round((c.value / totalPie) * 100) : 0,
          color: COLORS[i % COLORS.length]
        }));
        setAllocation(topCats);

        // 4. LINE CHART (Xu hướng xuất kho 30 ngày)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0,0,0,0);

        const lineData = [];
        for(let i=0; i<30; i++) {
          const target = new Date(thirtyDaysAgo);
          target.setDate(target.getDate() + i);
          lineData.push({
            dateObj: target,
            day: `${target.getDate()}/${target.getMonth()+1}`,
            export: 0
          });
        }

        const exportPurchases = purchases.filter(p => Number(p.type || p.Type) === 2);
        exportPurchases.forEach(p => {
          const dateStr = p.receiptDate || p.createDate || p.purchaseDate || p.createdAt;
          if (!dateStr) return;
          const d = new Date(dateStr);
          d.setHours(0,0,0,0);
          
          if (d >= thirtyDaysAgo) {
            const index = Math.floor((d - thirtyDaysAgo) / (1000 * 60 * 60 * 24));
            if (index >= 0 && index < 30) {
              const qty = (p.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
              lineData[index].export += qty;
            }
          }
        });
        setLineChartData(lineData);

        // 5. RESTOCK TABLE
        const lowStockList = products
          .filter(p => (p.quantity || p.initialStock || 0) < 10)
          .map(p => {
            const stock = p.quantity || p.initialStock || 0;
            return {
              id: p.code || p.id,
              name: p.name,
              stock: stock,
              status: stock <= 3 ? 'Nguy hiểm' : 'Cảnh báo',
              color: stock <= 3 ? 'red' : 'orange'
            };
          })
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setRestockProducts(lowStockList);

        // 6. TOP SELLING TABLE
        const productSales = {};
        exportPurchases.forEach(p => {
          // Lấy status của xuất kho (thường status = 2 là đã hoàn thành)
          // Tùy theo logic API của bạn, tôi lấy tất cả hoặc status hoàn thành
          const isCompleted = p.status === 2 || p.status === 'completed';
          if (isCompleted || true) { // Tạm tính tất cả nếu không check kĩ status
            (p.items || []).forEach(item => {
              const pid = item.productId;
              const qty = item.quantity || 1;
              const price = item.unitPrice || item.unitCost || 0;
              
              if (!productSales[pid]) {
                productSales[pid] = { qty: 0, revenue: 0 };
              }
              productSales[pid].qty += qty;
              productSales[pid].revenue += qty * price;
            });
          }
        });

        const topSellingList = Object.keys(productSales)
          .map(pid => {
            const prod = products.find(x => String(x.id) === String(pid));
            return {
              id: prod?.code || pid,
              name: prod?.name || 'Không xác định',
              sold: productSales[pid].qty,
              revenue: productSales[pid].revenue
            };
          })
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);
          
        setTopProducts(topSellingList);

      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedYear]);

  return {
    stats,
    loading,
    chartData,
    allocation,
    lineChartData,
    restockProducts,
    topProducts,
    selectedYear,
    setSelectedYear,
    availableYears
  };
}
