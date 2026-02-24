import { BookOpen, Camera, Radio, Zap, Shield, AlertTriangle, FileText, Compass } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Resources() {
  const phenomena = [
    {
      icon: BookOpen,
      title: 'Apparitions',
      description: 'Visual manifestations of spirits or entities, ranging from transparent figures to full-body materializations.',
      examples: [
        'Shadow figures moving across walls or doorways',
        'Transparent or translucent human forms',
        'Partial manifestations (faces, hands, or torsos)',
        'Residual hauntings (repeated scenes from the past)',
      ],
    },
    {
      icon: Radio,
      title: 'Unexplained Sounds',
      description: 'Auditory phenomena without identifiable physical sources, often recorded as Electronic Voice Phenomena (EVP).',
      examples: [
        'Disembodied voices or whispers',
        'Phantom footsteps or knocking',
        'Unexplained music or singing',
        'Scratching or tapping sounds within walls',
      ],
    },
    {
      icon: Compass,
      title: 'Moving Objects',
      description: 'Physical objects that move, levitate, or are thrown without apparent cause, often associated with poltergeist activity.',
      examples: [
        'Objects falling from shelves or tables',
        'Doors opening or closing on their own',
        'Items appearing in different locations',
        'Levitation of small objects',
      ],
    },
    {
      icon: Zap,
      title: 'Electromagnetic Anomalies',
      description: 'Unusual electromagnetic field readings that cannot be explained by conventional sources.',
      examples: [
        'Sudden spikes in EMF readings',
        'Electronic devices malfunctioning',
        'Unexplained temperature drops',
        'Battery drainage in multiple devices',
      ],
    },
  ];

  const equipment = [
    {
      name: 'EMF Meter',
      purpose: 'Detects electromagnetic field fluctuations that may indicate paranormal presence',
      usage: 'Baseline readings should be taken first, then monitor for sudden spikes or anomalies',
    },
    {
      name: 'Digital Voice Recorder',
      purpose: 'Captures Electronic Voice Phenomena (EVP) that may not be audible in real-time',
      usage: 'Use high-quality recorders in quiet environments, ask questions and leave pauses for responses',
    },
    {
      name: 'Thermal Camera',
      purpose: 'Detects temperature variations and cold spots associated with paranormal activity',
      usage: 'Document baseline temperatures and watch for sudden, localized temperature changes',
    },
    {
      name: 'Full Spectrum Camera',
      purpose: 'Captures images beyond visible light spectrum, potentially revealing unseen entities',
      usage: 'Take multiple photos from different angles, compare with standard photography',
    },
    {
      name: 'Motion Sensors',
      purpose: 'Detects movement in areas where no physical presence should exist',
      usage: 'Place in strategic locations and monitor for activations without visible cause',
    },
    {
      name: 'Spirit Box',
      purpose: 'Rapidly scans radio frequencies to facilitate real-time spirit communication',
      usage: 'Ask clear questions and listen for intelligent responses through the static',
    },
  ];

  const documentation = [
    'Record all baseline readings before investigation begins',
    'Document environmental conditions (weather, temperature, humidity)',
    'Note all equipment used and their settings',
    'Timestamp all phenomena and equipment readings',
    'Take photographs from multiple angles',
    'Record detailed notes of personal experiences',
    'Interview all witnesses separately',
    'Create floor plans marking activity locations',
    'Maintain chain of custody for all evidence',
    'Review all recordings multiple times',
  ];

  const safety = [
    'Never investigate alone - always work in teams of at least two',
    'Inform someone outside the team of your location and expected return time',
    'Carry fully charged communication devices and backup batteries',
    'Wear appropriate protective equipment for the location',
    'Be aware of structural hazards in abandoned or old buildings',
    'Respect property boundaries and obtain proper permissions',
    'Know your exit routes and have emergency plans',
    'Stay calm and rational - fear can cloud judgment',
    'If you feel threatened or uncomfortable, leave immediately',
    'Seek professional help if experiencing negative effects after investigation',
  ];

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Investigation <span className="text-ethereal">Resources</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Comprehensive guides and information for understanding and investigating paranormal phenomena. Learn about different types of activity, equipment, and best practices.
        </p>
      </div>

      <Tabs defaultValue="phenomena" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="phenomena" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Phenomena</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Safety</span>
          </TabsTrigger>
        </TabsList>

        {/* Phenomena Tab */}
        <TabsContent value="phenomena" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-ethereal" />
                Types of Paranormal Phenomena
              </CardTitle>
              <CardDescription>
                Understanding different categories of paranormal activity and their characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {phenomena.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-6" />}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-ethereal/10 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-ethereal" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Common Examples:</p>
                        <ul className="space-y-1">
                          {item.examples.map((example, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-ethereal mt-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-ethereal" />
                Investigation Equipment
              </CardTitle>
              <CardDescription>
                Essential tools for detecting and documenting paranormal activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipment.map((item, index) => (
                  <Card key={index} className="border-border/40 bg-background/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-ethereal mb-1">Purpose:</p>
                        <p className="text-sm text-muted-foreground">{item.purpose}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ethereal mb-1">Usage:</p>
                        <p className="text-sm text-muted-foreground">{item.usage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-ethereal" />
                Evidence Documentation Guidelines
              </CardTitle>
              <CardDescription>
                Best practices for recording and preserving paranormal evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentation.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-ethereal/20 text-ethereal flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-sm text-muted-foreground pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-ethereal/5 border border-ethereal/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-ethereal">Remember:</strong> Thorough documentation is crucial for credible paranormal research. The more detailed your records, the more valuable your evidence becomes for analysis and verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-ethereal" />
                Safety Precautions
              </CardTitle>
              <CardDescription>
                Essential safety guidelines for paranormal investigations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safety.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                    <AlertTriangle className="flex-shrink-0 h-5 w-5 text-ethereal mt-0.5" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive-foreground">
                  <strong className="text-destructive">Warning:</strong> Paranormal investigation can involve physical risks from unstable structures, environmental hazards, and psychological stress. Always prioritize your safety and well-being above gathering evidence.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
