import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Ghost, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CaseDetail() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <Ghost className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-display font-bold text-foreground">Login Required</h2>
          <p className="text-muted-foreground max-w-sm">
            Please log in to view case details.
          </p>
          <Button onClick={login} disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Case Detail</h1>
        <p className="text-muted-foreground">Case details will appear here.</p>
      </div>
    </div>
  );
}
