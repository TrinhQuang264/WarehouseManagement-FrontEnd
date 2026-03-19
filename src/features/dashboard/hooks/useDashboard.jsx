import { useState, useEffect } from 'react';
import dashboardService from '../api/dashboardService';

// MOCK DATA — Dùng khi chưa có backend
const MOCK_STATS = {
  totalInventory: 24510,
  lowStockCount: 18,
  todayImport: 1240,
  todayExport: 958,
};

export const MOCK_CHART_DATA = [
  { day: 'Thứ 2', import: 85, export: 60 },
  { day: 'Thứ 3', import: 70, export: 40 },
  { day: 'Thứ 4', import: 45, export: 55 },
  { day: 'Thứ 5', import: 95, export: 75 },
  { day: 'Thứ 6', import: 50, export: 30 },
  { day: 'Thứ 7', import: 35, export: 20 },
  { day: 'CN', import: 25, export: 15 },
];

export const MOCK_ALLOCATION = [
  { name: 'Màn hình', value: 45, color: '#137fec' }, // bg-primary
  { name: 'Pin điện thoại', value: 25, color: '#f59e0b' }, // bg-accent-orange
  { name: 'Vỏ & Linh kiện khác', value: 30, color: '#10b981' }, // bg-accent-green
];

export const MOCK_TOP_PRODUCTS = [
  {
    id: 1,
    name: 'Màn hình iPhone 13 Pro Max',
    type: 'OLED Zin',
    sku: 'SCR-I13PM-001',
    sold: 452,
    stock: 1240,
    revenue: 1250000000,
    status: 'selling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-19TXUkPkRvBcNrvpN1fPSgnvDrg-MqaYnnClRW_vFiHS2azMg76QMhV-MpZp24pIsAH1S_g8kpwN5eGjTUX7bFLBOMUKMmjjJeDFpNvuxwefnLcs8lzg3PzttmK1HQlLwZFkCxMa0wkOfzsSC-vWV61X7KKJvZ9-3kmW7tjuRw5GduPl1qPU3M_EXAZTESo3lw0rsCH4mMdm5uNMVmnAcpa0fLnAuaUmxlY6ZoJGeGet5pbC7ydHHH4XRvWAFjstF_7PxWHFD8A',
  },
  {
    id: 2,
    name: 'Pin Samsung Galaxy S21 Ultra',
    type: 'Chính hãng',
    sku: 'BAT-SS21U-024',
    sold: 321,
    stock: 85,
    revenue: 245000000,
    status: 'low',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFaSW0OUOozyVpchJ5OgoYxAGAwl13QvIQIs3AmX3XO7SUT58szoPU4lCp4Jhel0bSvh54pMGL6e-2XR9kuCN_CMJ_FvBN4drIGq4NsSpGa2XcnlQzZ8dAGE-TfXRfBpwKj8Y2ZXTUgHStQ6PxepV9xM1HG7AH1FN4YajxrnGP-Xx9gyYBlPfUD2pZaicZO31-rjbJ_Fol0YAjF7JalYkCm-xJeq0DkpcJmJ3dBlEeIYT4MgqqCxlf2TQcwBuQUTvUq3kltX5l1-Y',
  },
  {
    id: 3,
    name: 'Vỏ mặt sau iPhone 14',
    type: 'Kính zin',
    sku: 'BKC-I14-99',
    sold: 215,
    stock: 512,
    revenue: 158000000,
    status: 'selling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7mROHl8WLDtgoDb18UjBAO6n1kYMfBe1AnQihVm8sV7g-kjB_hlDt10kCBqae1kYEhXGTT_t4ztGd83eEWqFLRyTKYQKP-xuiYlA3y5chzfM_a1Qprpxw2Bv8TCqa32yECLPABreh4aARvhHf5NheSWdJcmyhiPwYz3OrCAD0OGPn08WD-ZL7ZHDxUVHIkrJMLVhsP-Hhsnld629uSBbhw5suJJGy6reXfrgJzRci_VrClS8YZrPeTcC6lmRW0loDIW5EQn9Q5_g',
  },
];

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch {
        // API chưa có → dùng mock data
        console.info('[useDashboard] Sử dụng mock data (API chưa kết nối)');
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return {
    stats,
    loading,
    chartData: MOCK_CHART_DATA,
    allocation: MOCK_ALLOCATION,
    topProducts: MOCK_TOP_PRODUCTS
  };
}
