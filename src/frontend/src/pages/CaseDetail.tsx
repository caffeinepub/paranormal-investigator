import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Calendar, Clock, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGetCaseById } from '@/hooks/useQueries';
import { PhenomenaType, InvestigationStatus } from '@/backend';

export default function CaseDetail() {
  const { caseId } = useParams({ from: '/cases/$caseId' });
  const caseQuery = useGetCaseById(caseId);

  const getPhenomenaLabel = (type: PhenomenaType) => {
    const labels = {
      [PhenomenaType.apparitions]: 'Apparitions',
      [PhenomenaType.unexplainedSounds]: 'Unexplained Sounds',
      [PhenomenaType.movingObjects]: 'Moving Objects',
      [PhenomenaType.electromagneticAnomalies]: 'Electromagnetic Anomalies',
    };
    return labels[type];
  };

  const getStatusLabel = (status: InvestigationStatus) => {
    const labels = {
      [InvestigationStatus.submitted]: 'Submitted',
      [InvestigationStatus.underInvestigation]: 'Under Investigation',
      [InvestigationStatus.resolved]: 'Resolved',
      [InvestigationStatus.inconclusive]: 'Inconclusive',
    };
    return labels[status];
  };

  const getStatusVariant = (status: InvestigationStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants = {
      [InvestigationStatus.submitted]: 'secondary' as const,
      [InvestigationStatus.underInvestigation]: 'default' as const,
      [InvestigationStatus.resolved]: 'outline' as const,
      [InvestigationStatus.inconclusive]: 'destructive' as const,
    };
    return variants[status];
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (caseQuery.isLoading) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <Card className="border-border/40 bg-card/50 backdrop-blur animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!caseQuery.data) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The case you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/cases">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const caseData = caseQuery.data;

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <Link to="/cases">
        <Button variant="ghost" className="mb-6 hover:text-ethereal">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </Link>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(caseData.status)} className="text-sm">
                {getStatusLabel(caseData.status)}
              </Badge>
              <Badge variant="outline" className="border-ethereal/30 text-ethereal text-sm">
                {getPhenomenaLabel(caseData.phenomenaType)}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              Case #{caseData.caseId.slice(0, 8)}...
            </span>
          </div>
          <CardTitle className="text-3xl font-display">{caseData.location}</CardTitle>
          <CardDescription className="flex flex-wrap gap-4 text-sm pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {caseData.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(caseData.timestamp)}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Photo */}
          {caseData.photo && (
            <div className="rounded-lg overflow-hidden border border-border/40">
              <img
                src={caseData.photo.getDirectURL()}
                alt="Case evidence"
                className="w-full h-auto"
              />
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-ethereal" />
              Event Description
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {caseData.description}
            </p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-ethereal" />
              Contact Information
            </h3>
            <p className="text-muted-foreground">{caseData.contactInfo}</p>
          </div>

          <Separator />

          {/* Investigation Notes */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
            <h3 className="text-sm font-semibold mb-2 text-ethereal">Investigation Notes</h3>
            <p className="text-sm text-muted-foreground">
              {caseData.status === InvestigationStatus.submitted && 
                'This case has been submitted and is awaiting review by our investigation team.'}
              {caseData.status === InvestigationStatus.underInvestigation && 
                'Our team is actively investigating this case. We will update the status as we gather more evidence.'}
              {caseData.status === InvestigationStatus.resolved && 
                'This investigation has been completed. Our findings have been documented and shared with the reporter.'}
              {caseData.status === InvestigationStatus.inconclusive && 
                'After thorough investigation, we were unable to determine a definitive cause for the reported phenomena.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
