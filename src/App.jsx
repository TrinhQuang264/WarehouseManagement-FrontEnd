/**
 * App.jsx — Component gốc của ứng dụng
 *
 * Sau khi tách router ra file riêng, App.jsx chỉ còn:
 * 1. Bọc BrowserRouter
 * 2. Render AppRouter (cấu hình route ở src/router/index.jsx)
 *
 * LUỒNG TỔNG QUAN:
 *   main.jsx → AuthProvider → BrowserRouter → AppRouter → Pages
 */
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
