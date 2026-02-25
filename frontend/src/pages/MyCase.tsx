import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetMyCases } from '../hooks/useCaseQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Ghost, MapPin, Zap, FileSearch, LogIn, Loader2 } from 'lucide-react';

export default function MyCase() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const {
    data: caseResult,
    isLoading: casesLoading,
    error: casesError,
  } = useGetMyCases(profile?.email);

  const isLoading = profileLoading || casesLoading;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-display font-bold text-foreground">Login Required</h2>
          <p className="text-muted-foreground max-w-sm">
            Please log in to view your case status.
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profileFetched && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <Ghost className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-display font-bold text-foreground">Profile Not Found</h2>
          <p className="text-muted-foreground max-w-sm">
            Your profile hasn't been set up yet. Please complete your profile to view your cases.
          </p>
        </div>
      </div>
    );
  }

  const cases = caseResult?.caseSummaries ?? [];
  const hasCase = caseResult?.hasCase ?? false;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileSearch className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">My Case Files</h1>
          </div>
          {profile && (
            <p className="text-muted-foreground">
              Showing cases linked to <span className="text-foreground font-medium">{profile.email}</span>
            </p>
          )}
        </div>

        {/* Cases */}
        {casesError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive">Failed to load your cases. Please try again later.</p>
            </CardContent>
          </Card>
        ) : !hasCase || cases.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Ghost className="h-16 w-16 text-muted-foreground/40 mx-auto" />
              <h3 className="text-xl font-display font-semibold text-foreground">No Case Found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No active cases are linked to your account. If you've submitted a case, please ensure you used the same email address.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/submit-case' })}
                className="mt-2"
              >
                Submit a Case
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => (
              <Card
                key={c.caseId}
                className="border-border/50 hover:border-primary/30 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-display">
                        Case #{c.caseId.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{c.phenomenaType}</p>
                    </div>
                    <Badge
                      variant={c.status === 'Resolved' ? 'secondary' : 'default'}
                      className={
                        c.status === 'Resolved'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-primary/20 text-primary border-primary/30'
                      }
                    >
                      {c.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{c.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Zap className="h-4 w-4 flex-shrink-0" />
                    <span>Phenomena: {c.phenomenaType}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
