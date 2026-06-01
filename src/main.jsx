import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './features/auth/hooks/useAuth';
import { HeaderProvider } from './contexts/HeaderContext';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HeaderProvider>
        <App />
      </HeaderProvider>
    </AuthProvider>
  </StrictMode>
);
