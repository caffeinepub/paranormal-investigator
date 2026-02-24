import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Filter, MapPin, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllCases, useFilterCasesByType, useFilterCasesByLocation } from '@/hooks/useQueries';
import { PhenomenaType, InvestigationStatus } from '@/backend';

export default function CaseGallery() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<PhenomenaType | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState('');

  const allCasesQuery = useGetAllCases();
  const filteredByTypeQuery = useFilterCasesByType(filterType as PhenomenaType);
  const filteredByLocationQuery = useFilterCasesByLocation(locationFilter);

  // Determine which query to use
  const cases = locationFilter
    ? filteredByLocationQuery.data || []
    : filterType !== 'all'
    ? filteredByTypeQuery.data || []
    : allCasesQuery.data || [];

  const isLoading = allCasesQuery.isLoading || filteredByTypeQuery.isLoading || filteredByLocationQuery.isLoading;

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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCaseClick = (caseId: string) => {
    navigate({ to: '/cases/$caseId', params: { caseId } });
  };

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Oklahoma Case <span className="text-ethereal">Gallery</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our collection of documented paranormal cases from across Oklahoma. Each investigation is carefully catalogued and analyzed by our team. All cases displayed are from Oklahoma locations.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Oklahoma Cases
          </CardTitle>
          <CardDescription>Narrow down cases by phenomena type or Oklahoma location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phenomenaType">Phenomena Type</Label>
              <Select value={filterType} onValueChange={(value) => {
                setFilterType(value as PhenomenaType | 'all');
                setLocationFilter('');
              }}>
                <SelectTrigger id="phenomenaType">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={PhenomenaType.apparitions}>Apparitions</SelectItem>
                  <SelectItem value={PhenomenaType.unexplainedSounds}>Unexplained Sounds</SelectItem>
                  <SelectItem value={PhenomenaType.movingObjects}>Moving Objects</SelectItem>
                  <SelectItem value={PhenomenaType.electromagneticAnomalies}>Electromagnetic Anomalies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Oklahoma Location</Label>
              <Input
                id="location"
                placeholder="Search by Oklahoma city..."
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setFilterType('all');
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/50 backdrop-blur animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cases.length === 0 ? (
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="py-12 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No Oklahoma cases found matching your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <Card 
              key={caseItem.caseId} 
              className="h-full border-border/40 bg-card/50 backdrop-blur hover:border-ethereal/30 transition-all duration-300 hover:shadow-lg hover:shadow-ethereal/10 cursor-pointer group"
              onClick={() => handleCaseClick(caseItem.caseId)}
            >
              {caseItem.photo && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={caseItem.photo.getDirectURL()}
                    alt="Case evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={getStatusVariant(caseItem.status)}>
                    {getStatusLabel(caseItem.status)}
                  </Badge>
                  <Badge variant="outline" className="border-ethereal/30 text-ethereal">
                    {getPhenomenaLabel(caseItem.phenomenaType)}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-1 group-hover:text-ethereal transition-colors">
                  {caseItem.location}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {caseItem.location.split(',')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(caseItem.timestamp)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {caseItem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
