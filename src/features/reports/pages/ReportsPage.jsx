import React, { useEffect } from 'react';
import { useHeader } from '../../../contexts/HeaderContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReportsPage() {
  const { setTitle, resetHeader } = useHeader();

  useEffect(() => {
    setTitle('Báo cáo');
    return () => resetHeader();
  }, [setTitle, resetHeader]);

  return (
    <div className="reports-page">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-headline tracking-tight">Báo cáo Nhập - Xuất - Tồn chi tiết</h2>
          <p className="text-xs text-secondary mt-1">Dữ liệu tổng hợp từ 01/10/2023 đến 31/10/2023</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Thời gian:</span>
            <select className="border-none bg-transparent text-xs font-medium focus:ring-0 p-0 pr-6 cursor-pointer outline-none text-slate-700">
              <option>Tháng này</option>
              <option>Tháng trước</option>
              <option>Quý này</option>
              <option>Tùy chọn...</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95">
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse compact-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="font-bold text-slate-600 uppercase tracking-widest text-[10px] border-r border-slate-200 px-3 py-2" rowSpan="2">Mã linh kiện</th>
                <th className="font-bold text-slate-600 uppercase tracking-widest text-[10px] border-r border-slate-200 px-3 py-2" rowSpan="2">Tên linh kiện</th>
                <th className="font-bold text-slate-600 uppercase tracking-widest text-[10px] border-r border-slate-200 text-center px-3 py-2" rowSpan="2">ĐVT</th>
                <th className="text-center font-bold text-slate-600 uppercase tracking-widest text-[10px] border-b border-r border-slate-200 py-2 bg-slate-50" colSpan="2">Tồn đầu kỳ</th>
                <th className="text-center font-bold text-slate-600 uppercase tracking-widest text-[10px] border-b border-r border-slate-200 py-2" colSpan="2">Nhập trong kỳ</th>
                <th className="text-center font-bold text-slate-600 uppercase tracking-widest text-[10px] border-b border-r border-slate-200 py-2 bg-slate-50" colSpan="2">Xuất trong kỳ</th>
                <th className="text-center font-bold text-slate-600 uppercase tracking-widest text-[10px] border-b border-slate-200 py-2" colSpan="2">Tồn cuối kỳ</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 bg-slate-50/50 px-3 py-2">Số lượng</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 bg-slate-50/50 px-3 py-2">Giá trị</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 px-3 py-2">Số lượng</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 px-3 py-2">Giá trị</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 bg-slate-50/50 px-3 py-2">Số lượng</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 bg-slate-50/50 px-3 py-2">Giá trị</th>
                <th className="text-right font-medium text-slate-500 text-[10px] border-r border-slate-200 px-3 py-2">Số lượng</th>
                <th className="text-right font-medium text-slate-500 text-[10px] px-3 py-2">Giá trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-primary font-medium px-3 py-2 text-xs">LK-00129-CPU</td>
                <td className="font-medium text-slate-900 px-3 py-2 text-xs">Vi xử lý Intel Core i7 12700K</td>
                <td className="text-center text-slate-500 px-3 py-2 text-xs">Cái</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">45</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">382.500.000</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">120</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">1.020.000.000</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">85</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">722.500.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">80</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">680.000.000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-primary font-medium px-3 py-2 text-xs">LK-00543-RAM</td>
                <td className="font-medium text-slate-900 px-3 py-2 text-xs">RAM Kingston Fury 16GB DDR5</td>
                <td className="text-center text-slate-500 px-3 py-2 text-xs">Cái</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">210</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">462.000.000</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">300</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">660.000.000</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">150</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">330.000.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">360</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">792.000.000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-primary font-medium px-3 py-2 text-xs">LK-00812-SSD</td>
                <td className="font-medium text-slate-900 px-3 py-2 text-xs">SSD Samsung 980 Pro 1TB</td>
                <td className="text-center text-slate-500 px-3 py-2 text-xs">Cái</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">85</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">221.000.000</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">50</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">130.000.000</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">92</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">239.200.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">43</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">111.800.000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-primary font-medium px-3 py-2 text-xs">LK-00221-GPU</td>
                <td className="font-medium text-slate-900 px-3 py-2 text-xs">ASUS ROG Strix RTX 3080</td>
                <td className="text-center text-slate-500 px-3 py-2 text-xs">Cái</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">12</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">264.000.000</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">20</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">440.000.000</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">18</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">396.000.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">14</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">308.000.000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-primary font-medium px-3 py-2 text-xs">LK-00993-FAN</td>
                <td className="font-medium text-slate-900 px-3 py-2 text-xs">Noctua NH-D15 Chromax.Black</td>
                <td className="text-center text-slate-500 px-3 py-2 text-xs">Cái</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">50</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">125.000.000</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">100</td>
                <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs">250.000.000</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">120</td>
                <td className="text-right font-mono text-slate-600 bg-slate-50/30 px-3 py-2 text-xs">300.000.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">30</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">75.000.000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-primary/20">
                <td className="font-bold text-slate-900 uppercase tracking-wider text-[10px] py-3 pl-4" colSpan="3">Tổng cộng cuối kỳ</td>
                <td className="text-right font-mono font-bold text-slate-900 bg-slate-50/50 px-3 py-2 text-xs">402</td>
                <td className="text-right font-mono font-bold text-slate-900 bg-slate-50/50 px-3 py-2 text-xs">1.454.500.000</td>
                <td className="text-right font-mono font-bold text-slate-900 px-3 py-2 text-xs">590</td>
                <td className="text-right font-mono font-bold text-slate-900 px-3 py-2 text-xs">2.500.000.000</td>
                <td className="text-right font-mono font-bold text-slate-900 bg-slate-50/50 px-3 py-2 text-xs">465</td>
                <td className="text-right font-mono font-bold text-slate-900 bg-slate-50/50 px-3 py-2 text-xs">1.987.700.000</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">527</td>
                <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">1.966.800.000</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination & Summary Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị:</span>
            <select className="border border-slate-200 bg-white text-[11px] font-bold py-1 px-2 rounded-lg focus:ring-primary/20 cursor-pointer outline-none text-slate-700">
              <option>5 dòng</option>
              <option>10 dòng</option>
              <option>20 dòng</option>
              <option>50 dòng</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500 font-medium italic">Đang hiển thị 5 trên tổng số 1.240 linh kiện trong kho.</p>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary transition-colors active:scale-95">
            <span className="material-symbols-outlined text-sm"><ChevronLeft /></span>
          </button>
          <div className="flex items-center gap-1 mx-2">
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-[11px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-50 transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-50 transition-colors">3</button>
            <span className="text-slate-500 px-1">...</span>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-50 transition-colors">248</button>
          </div>
          <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary transition-colors active:scale-95">
            <span className="material-symbols-outlined text-sm"><ChevronRight /></span>
          </button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tồn kho hiện tại</p>
            <h3 className="text-xl font-black text-slate-900">24.810</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-2">
              +4.2% so với tháng trước
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng giá trị tồn</p>
            <h3 className="text-xl font-black text-slate-900">1.966,8 tỷ</h3>
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-2">
              -1.8% trượt giá linh kiện
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Số lượt nhập kho</p>
            <h3 className="text-xl font-black text-slate-900">124</h3>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-2">
              Trung bình 4.1 phiếu/ngày
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sản phẩm sắp hết</p>
            <h3 className="text-xl font-black text-red-500">18</h3>
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-2">
              Cần nhập hàng ngay
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            </div>
        </div>
      </div>
    </div>
  );
}
