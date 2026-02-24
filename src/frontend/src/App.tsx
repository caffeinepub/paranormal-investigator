import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Home from './pages/Home';
import SubmitCase from './pages/SubmitCase';
import CaseGallery from './pages/CaseGallery';
import CaseDetail from './pages/CaseDetail';
import Resources from './pages/Resources';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const submitCaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-case',
  component: SubmitCase,
});

const casesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cases',
  component: CaseGallery,
});

const caseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cases/$caseId',
  component: CaseDetail,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: Resources,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  submitCaseRoute,
  casesRoute,
  caseDetailRoute,
  resourcesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
