import { createBrowserRouter, Navigate } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Dashboard from '../pages/Dashboard';
import UserList from '../pages/UserList';
import ProjectList from '../pages/ProjectList';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RequireAuth from '../components/RequireAuth';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/settings/projects',
        element: <ProjectList />,
      },
      {
        path: '/settings/users',
        element: <UserList />,
      },
    ],
  },
]);

export default router;
