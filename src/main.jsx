/**
 * main.jsx — Điểm khởi đầu (Entry Point) của ứng dụng
 *
 * LUỒNG KHỞI ĐỘNG:
 * 1. Import CSS global (Tailwind + custom styles)
 * 2. Import React & ReactDOM
 * 3. Bọc App trong AuthProvider → cung cấp context auth cho toàn app
 * 4. Render vào DOM element #root
 *
 * CẤU TRÚC COMPONENT TREE:
 *   <StrictMode>
 *     <AuthProvider>        ← Cung cấp auth context (user, login, logout)
 *       <App />             ← Router + Layout + Pages
 *     </AuthProvider>
 *   </StrictMode>
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
