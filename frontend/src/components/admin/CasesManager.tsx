import { useState } from 'react';
import { CheckCircle2, Trash2, Download, Loader2, ImageIcon, Clock, MapPin, Phone, CheckCheck } from 'lucide-react';
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
import { useGetAllCases, useMarkCaseResolved, useDeleteCase } from '../../hooks/useCaseQueries';
import type { Case } from '../../backend';

function formatTimestamp(ts: bigint): string {
  // Backend stores nanoseconds
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
  const headers = ['ID', 'Location', 'Phenomena Type', 'Description', 'Contact Info', 'Submission Date', 'Resolved', 'Photo URL'];
  const rows = cases.map((c) => {
    const photoUrl = c.photo ? c.photo.getDirectURL() : '';
    const date = formatTimestamp(c.timestamp);
    const resolved = c.resolved ? 'Yes' : 'No';
    // Escape fields that may contain commas or quotes
    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    return [
      escape(c.id),
      escape(c.location),
      escape(c.phenomenaType),
      escape(c.description),
      escape(c.contactInfo),
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

function CaseCard({ caseItem }: { caseItem: Case }) {
  const markResolved = useMarkCaseResolved();
  const deleteCase = useDeleteCase();

  const photoUrl = caseItem.photo ? caseItem.photo.getDirectURL() : null;

  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm transition-all ${caseItem.resolved ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
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
            <Badge variant="outline" className="border-border/60 text-muted-foreground text-xs">
              {caseItem.phenomenaType}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTimestamp(caseItem.timestamp)}
          </div>
        </div>
        <CardTitle className="font-heading text-base mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-ethereal flex-shrink-0" />
          {caseItem.location}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{caseItem.description}</p>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Contact Info</p>
          <p className="text-sm text-foreground/90 flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {caseItem.contactInfo}
          </p>
        </div>

        {/* Photo */}
        {photoUrl && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Photo Evidence</p>
            <div className="relative rounded-lg overflow-hidden border border-border/50 bg-background/30 max-w-xs">
              <img
                src={photoUrl}
                alt="Case evidence"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        {!photoUrl && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <ImageIcon className="h-3 w-3" />
            No photo submitted
          </div>
        )}

        {/* Case ID */}
        <p className="text-xs text-muted-foreground/50 font-mono">ID: {caseItem.id}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="border-ethereal/40 hover:bg-ethereal/10 hover:border-ethereal/60 text-ethereal disabled:opacity-40"
            disabled={caseItem.resolved || markResolved.isPending}
            onClick={() => markResolved.mutate(caseItem.id)}
          >
            {markResolved.isPending ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            )}
            {caseItem.resolved ? 'Resolved' : 'Mark Resolved'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/40 hover:bg-destructive/10 hover:border-destructive/60 text-destructive"
                disabled={deleteCase.isPending}
              >
                {deleteCase.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 mr-1" />
                )}
                Delete
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
      </CardContent>
    </Card>
  );
}

export default function CasesManager() {
  const { data: cases, isLoading, error } = useGetAllCases();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredCases = (cases ?? []).filter((c) => {
    if (filter === 'open') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const openCount = (cases ?? []).filter((c) => !c.resolved).length;
  const resolvedCount = (cases ?? []).filter((c) => c.resolved).length;

  return (
    <div className="space-y-6">
      {/* Stats + Export Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="border-border/60 text-muted-foreground">
            Total: {cases?.length ?? 0}
          </Badge>
          <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal">
            Open: {openCount}
          </Badge>
          <Badge variant="outline" className="border-border/60 text-muted-foreground">
            Resolved: {resolvedCount}
          </Badge>
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

      {/* Filter Tabs */}
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

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/50 bg-card/50">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <p className="text-sm">Failed to load cases. You may not have admin permissions.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCases.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No {filter !== 'all' ? filter : ''} cases found</p>
          <p className="text-sm mt-1">
            {filter === 'all'
              ? 'Case submissions will appear here once people submit through the form.'
              : `No ${filter} cases at this time.`}
          </p>
        </div>
      )}

      {/* Cases Grid */}
      {!isLoading && !error && filteredCases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      )}
    </div>
  );
}
