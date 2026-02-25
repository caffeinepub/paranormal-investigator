import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Team from './pages/Team';
import SubmitCase from './pages/SubmitCase';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
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

const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team',
  component: Team,
});

const submitCaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-case',
  component: SubmitCase,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  resourcesRoute,
  teamRoute,
  submitCaseRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AdminProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AdminProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
