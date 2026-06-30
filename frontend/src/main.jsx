import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';
import './styles/index.css';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog/:slug', element: <BlogDetail /> },
      { path: '/editor', element: <EditorPage /> },
      { path: '/admin', element: <Admin /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/login', element: <Auth /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
