import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext';

const router = createBrowserRouter([
  {
    path: "*",
    Component: AppRouter,
  }
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
