import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppRouter from './routes';

const router = createBrowserRouter([
  {
    path: "*",
    Component: AppRouter,
  }
]);

export default function App() {
  return (
      <RouterProvider router={router} />
  );
}
