import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Resources from './pages/Resources';
import SubmitCase from './pages/SubmitCase';
import CaseGallery from './pages/CaseGallery';
import CaseDetail from './pages/CaseDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCases from './pages/AdminCases';
import CaseFiles from './pages/CaseFiles';
import MyCase from './pages/MyCase';
import SupernaturalPinLogin from './pages/SupernaturalPinLogin';

const queryClient = new QueryClient();

function PostLoginRedirect() {
  const { identity } = useInternetIdentity();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (identity && !hasRedirected.current) {
      hasRedirected.current = true;
    }
  }, [identity]);

  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <PostLoginRedirect />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: Resources,
});

const submitCaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-case',
  component: SubmitCase,
});

const caseGalleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cases',
  component: CaseGallery,
});

const caseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cases/$caseId',
  component: CaseDetail,
});

const myCaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-case',
  component: MyCase,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

// Dedicated Cases Management page — full table view with detail modal
const adminCasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/cases',
  component: AdminCases,
});

// Legacy case files route — kept for backward compatibility
const caseFilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/case-files',
  component: CaseFiles,
});

// Secret admin access route — not linked in any navigation
const supernaturalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/supernatural',
  component: SupernaturalPinLogin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  resourcesRoute,
  submitCaseRoute,
  caseGalleryRoute,
  caseDetailRoute,
  myCaseRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminCasesRoute,
  caseFilesRoute,
  supernaturalRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </QueryClientProvider>
  );
}
