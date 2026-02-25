import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAdminContext } from '../contexts/AdminContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../backend';
import {
  CheckCircle2,
  Trash2,
  Download,
  Loader2,
  ImageIcon,
  Clock,
  MapPin,
  Phone,
  CheckCheck,
  Shield,
  LayoutDashboard,
  LogOut,
  FolderOpen,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useGetAllCases, useMarkCaseResolved, useDeleteCase, useInitAdmin } from '../hooks/useCaseQueries';
import type { Case } from '../backend';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function exportToCSV(cases: Case[]) {
  const headers = ['ID', 'Location', 'Phenomena Type', 'Description', 'Contact Info', 'Owner Email', 'Submission Date', 'Resolved', 'Photo URL'];
  const rows = cases.map((c) => {
    const photoUrl = c.photo ? c.photo.getDirectURL() : '';
    const date = formatTimestamp(c.timestamp);
    const resolved = c.resolved ? 'Yes' : 'No';
    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    return [
      escape(c.id),
      escape(c.location),
      escape(c.phenomenaType),
      escape(c.description),
      escape(c.contactInfo),
      escape(c.ownerEmail),
      escape(date),
      resolved,
      escape(photoUrl),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cases-export.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function CaseDetailModal({ caseItem, open, onClose }: { caseItem: Case; open: boolean; onClose: () => void }) {
  const photoUrl = caseItem.photo ? caseItem.photo.getDirectURL() : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border/50 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-ethereal" />
            {caseItem.location}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Case ID: <span className="font-mono text-xs">{caseItem.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status & Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={caseItem.resolved ? 'secondary' : 'default'}
              className={caseItem.resolved
                ? 'bg-muted text-muted-foreground'
                : 'bg-ethereal/20 text-ethereal border-ethereal/40'}
            >
              {caseItem.resolved ? (
                <><CheckCheck className="h-3 w-3 mr-1" />Resolved</>
              ) : (
                'Open'
              )}
            </Badge>
            <Badge variant="outline" className="border-border/60 text-muted-foreground">
              {caseItem.phenomenaType}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {formatTimestamp(caseItem.timestamp)}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-foreground/90 leading-relaxed bg-background/50 rounded-lg p-3 border border-border/40">
              {caseItem.description}
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Contact Info</p>
              <p className="text-sm text-foreground/90 flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                {caseItem.contactInfo}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Owner Email</p>
              <p className="text-sm text-foreground/90 truncate">{caseItem.ownerEmail}</p>
            </div>
          </div>

          {/* Photo */}
          {photoUrl ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Photo Evidence</p>
              <div className="rounded-lg overflow-hidden border border-border/50 bg-background/30">
                <img
                  src={photoUrl}
                  alt="Case evidence"
                  className="w-full max-h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 bg-background/30 rounded-lg p-3 border border-border/30">
              <ImageIcon className="h-4 w-4" />
              No photo evidence submitted
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseRow({ caseItem }: { caseItem: Case }) {
  const markResolved = useMarkCaseResolved();
  const deleteCase = useDeleteCase();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <CaseDetailModal caseItem={caseItem} open={showDetail} onClose={() => setShowDetail(false)} />
      <tr className={`border-b border-border/30 hover:bg-accent/30 transition-colors ${caseItem.resolved ? 'opacity-60' : ''}`}>
        {/* Status */}
        <td className="px-4 py-3">
          <Badge
            variant={caseItem.resolved ? 'secondary' : 'default'}
            className={caseItem.resolved
              ? 'bg-muted text-muted-foreground text-xs'
              : 'bg-ethereal/20 text-ethereal border-ethereal/40 text-xs'}
          >
            {caseItem.resolved ? (
              <><CheckCheck className="h-3 w-3 mr-1" />Resolved</>
            ) : (
              'Open'
            )}
          </Badge>
        </td>

        {/* Location */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ethereal flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate max-w-[160px]">{caseItem.location}</span>
          </div>
        </td>

        {/* Phenomena Type */}
        <td className="px-4 py-3 hidden md:table-cell">
          <Badge variant="outline" className="border-border/60 text-muted-foreground text-xs">
            {caseItem.phenomenaType}
          </Badge>
        </td>

        {/* Description */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{caseItem.description}</p>
        </td>

        {/* Date */}
        <td className="px-4 py-3 hidden sm:table-cell">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimestamp(caseItem.timestamp)}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-ethereal/10 hover:text-ethereal"
              onClick={() => setShowDetail(true)}
              title="View Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-ethereal/10 hover:text-ethereal disabled:opacity-40"
              disabled={caseItem.resolved || markResolved.isPending}
              onClick={() => markResolved.mutate(caseItem.id)}
              title="Mark as Resolved"
            >
              {markResolved.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                  disabled={deleteCase.isPending}
                  title="Delete Case"
                >
                  {deleteCase.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Case</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete this case from {caseItem.location}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border/60">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={() => deleteCase.mutate(caseItem.id)}
                  >
                    Delete Case
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </td>
      </tr>
    </>
  );
}

function AdminCasesContent() {
  const { identity } = useInternetIdentity();
  const { isAdmin: isPinAdmin } = useAdminContext();

  // Trigger admin initialization for Internet Identity users.
  // This registers the first authenticated principal as admin on the backend.
  const {
    isLoading: adminInitLoading,
    isError: adminInitError,
  } = useInitAdmin();

  const { data: cases, isLoading: casesLoading, error: casesError } = useGetAllCases();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredCases = (cases ?? []).filter((c) => {
    if (filter === 'open') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const openCount = (cases ?? []).filter((c) => !c.resolved).length;
  const resolvedCount = (cases ?? []).filter((c) => c.resolved).length;

  // Show initializing state while registering admin principal (II users only)
  const isInitializing = !!identity && !isPinAdmin && adminInitLoading;
  const isLoading = isInitializing || casesLoading;
  const error = casesError;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-foreground">{cases?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Cases</p>
          </CardContent>
        </Card>
        <Card className="border-ethereal/30 bg-ethereal/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-ethereal">{openCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Open</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-muted-foreground">{resolvedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter + Export Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-ethereal/20 text-ethereal border border-ethereal/40'
                  : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border/60 hover:border-ethereal/40 hover:bg-ethereal/10 hover:text-ethereal transition-colors"
          onClick={() => cases && exportToCSV(cases)}
          disabled={!cases || cases.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Initializing admin state */}
      {isInitializing && (
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="h-6 w-6 mx-auto mb-3 animate-spin text-ethereal" />
          <p className="text-sm">Initializing admin access...</p>
        </div>
      )}

      {/* Loading cases */}
      {!isInitializing && casesLoading && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24 hidden md:block" />
                <Skeleton className="h-5 flex-1 hidden lg:block" />
                <Skeleton className="h-5 w-28 hidden sm:block" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-12 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
          <Shield className="h-8 w-8 mx-auto mb-3 opacity-60" />
          <p className="text-sm font-medium">Failed to load cases</p>
          <p className="text-xs text-muted-foreground mt-1">
            {adminInitError
              ? 'Could not initialize admin access. Please try logging out and back in.'
              : 'You may not have admin permissions or the backend is unavailable.'}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCases.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No {filter !== 'all' ? filter : ''} cases found</p>
          <p className="text-sm mt-1">
            {filter === 'all'
              ? 'Case submissions will appear here once people submit through the form.'
              : `No ${filter} cases at this time.`}
          </p>
        </div>
      )}

      {/* Cases Table */}
      {!isLoading && !error && filteredCases.length > 0 && (
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-background/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <CaseRow key={c.id} caseItem={c} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function AdminCases() {
  const { identity, clear } = useInternetIdentity();
  const { logout: adminLogout } = useAdminContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    adminLogout();
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <ProtectedRoute requiredRole={UserRole.admin}>
      <div className="min-h-screen bg-background">
        {/* Admin Header Bar */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-foreground">Case Management</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Case Management</h1>
            <p className="text-muted-foreground mt-1">Review, manage, and resolve all paranormal case submissions.</p>
          </div>

          <AdminCasesContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}
