import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserRole } from '../hooks/useUserRole';
import { useAdmin } from '../hooks/useAdmin';
import { UserRole } from '../backend';
import { Loader2, ShieldX, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

// Read admin session directly from storage as a synchronous fallback
// to avoid React state timing issues during navigation.
function readAdminSessionFromStorage(): boolean {
  try {
    const SESSION_KEY = 'opi_admin_session';
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    if (fromSession) {
      const parsed = JSON.parse(fromSession);
      return !!parsed?.email;
    }
    const fromLocal = localStorage.getItem(SESSION_KEY);
    if (fromLocal) {
      const parsed = JSON.parse(fromLocal);
      return !!parsed?.email;
    }
  } catch {
    // ignore parse errors
  }
  return false;
}

export default function ProtectedRoute({ children, requiredRole = UserRole.admin }: ProtectedRouteProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: role, isLoading, isFetched } = useUserRole();
  const { isAdmin: isAdminContext } = useAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Check both React context state AND storage directly to handle
  // the case where navigation happens before React state propagates.
  const isAdminByStorage = readAdminSessionFromStorage();
  const isAdminViaPin = isAdminContext || isAdminByStorage;

  // Allow access if authenticated via the email/PIN admin login (AdminContext).
  if (requiredRole === UserRole.admin && isAdminViaPin) {
    return <>{children}</>;
  }

  // Allow access if authenticated via Internet Identity with the right role.
  const hasAdminAccess = role === UserRole.admin;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-display font-bold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground max-w-sm">
            You must be logged in to access this page.
          </p>
          <Button onClick={login} disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (requiredRole === UserRole.admin && !hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <ShieldX className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-display font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground max-w-sm">
            You don't have permission to access this page. Admin access is required.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
