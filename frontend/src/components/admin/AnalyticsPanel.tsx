import { Loader2, TrendingUp, FileText, Eye, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsData } from '../../hooks/useAdminQueries';

export default function AnalyticsPanel() {
  const { data, isLoading, error } = useAnalyticsData();

  const totalVisits = data?.pageVisits.reduce((sum, [, count]) => sum + Number(count), 0) ?? 0;
  const totalSubmissions = data?.submissions.reduce((sum, [, count]) => sum + Number(count), 0) ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ethereal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">Failed to load analytics. Make sure you have admin privileges on the blockchain.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-ethereal/30 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ethereal/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-ethereal" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Page Visits</p>
                <p className="font-display text-3xl font-bold text-ethereal glow-text-subtle">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-spectral/30 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-spectral/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-spectral" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Form Submissions</p>
                <p className="font-display text-3xl font-bold text-spectral">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Visits Breakdown */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-ethereal" />
            Page Visits Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.pageVisits.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No page visit data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.pageVisits
                .sort(([, a], [, b]) => Number(b) - Number(a))
                .map(([page, count]) => {
                  const pct = totalVisits > 0 ? (Number(count) / totalVisits) * 100 : 0;
                  return (
                    <div key={page} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{page}</span>
                        <span className="text-ethereal font-semibold">{Number(count)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ethereal to-spectral transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions Breakdown */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <FileText className="h-5 w-5 text-spectral" />
            Form Submissions Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.submissions.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No submission data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.submissions
                .sort(([, a], [, b]) => Number(b) - Number(a))
                .map(([type, count]) => {
                  const pct = totalSubmissions > 0 ? (Number(count) / totalSubmissions) * 100 : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground capitalize">{type.replace(/_/g, ' ')}</span>
                        <span className="text-spectral font-semibold">{Number(count)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-spectral to-phantom transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
