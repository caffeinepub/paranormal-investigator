import { BookOpen, Camera, Radio, Zap, Shield, AlertTriangle, FileText, Compass, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
      color: 'text-ethereal',
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
      color: 'text-spectral',
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
      color: 'text-phantom',
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
      color: 'text-ethereal',
    },
  ];

  const equipment = [
    {
      name: 'EMF Meter',
      purpose: 'Detects electromagnetic field fluctuations that may indicate paranormal presence',
      usage: 'Baseline readings should be taken first, then monitor for sudden spikes or anomalies',
      icon: Zap,
    },
    {
      name: 'Digital Voice Recorder',
      purpose: 'Captures Electronic Voice Phenomena (EVP) that may not be audible in real-time',
      usage: 'Use high-quality recorders in quiet environments, ask questions and leave pauses for responses',
      icon: Radio,
    },
    {
      name: 'Thermal Camera',
      purpose: 'Detects temperature variations and cold spots associated with paranormal activity',
      usage: 'Document baseline temperatures and watch for sudden, localized temperature changes',
      icon: Camera,
    },
    {
      name: 'Full Spectrum Camera',
      purpose: 'Captures images beyond visible light spectrum, potentially revealing unseen entities',
      usage: 'Take multiple photos from different angles, compare with standard photography',
      icon: Camera,
    },
    {
      name: 'Motion Sensors',
      purpose: 'Detects movement in areas where no physical presence should exist',
      usage: 'Place in strategic locations and monitor for activations without visible cause',
      icon: Compass,
    },
    {
      name: 'Spirit Box',
      purpose: 'Rapidly scans radio frequencies to facilitate real-time spirit communication',
      usage: 'Ask clear questions and listen for intelligent responses through the static',
      icon: Radio,
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
    <div className="container px-4 lg:px-6 py-16">
      <div className="mb-12 space-y-4">
        <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal">
          <Sparkles className="h-3 w-3 mr-2" />
          Knowledge Base
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
          Oklahoma Investigation <span className="text-ethereal">Resources</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Comprehensive guides and information for understanding and investigating paranormal phenomena in Oklahoma. Learn about different types of activity, equipment, and best practices for Oklahoma investigations.
        </p>
      </div>

      <Tabs defaultValue="phenomena" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-card/50 backdrop-blur-sm p-1">
          <TabsTrigger value="phenomena" className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Phenomena</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Safety</span>
          </TabsTrigger>
        </TabsList>

        {/* Phenomena Tab */}
        <TabsContent value="phenomena" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ethereal/10">
                  <BookOpen className="h-6 w-6 text-ethereal" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">Types of Paranormal Phenomena in Oklahoma</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Understanding different categories of paranormal activity and their characteristics in Oklahoma investigations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {phenomena.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-8" />}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-xl bg-ethereal/10 flex items-center justify-center">
                        <item.icon className={`h-7 w-7 ${item.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-heading font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">Common Examples:</p>
                        <ul className="space-y-2">
                          {item.examples.map((example, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-3 pl-2">
                              <span className={`${item.color} mt-1 text-lg`}>•</span>
                              <span className="leading-relaxed">{example}</span>
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
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ethereal/10">
                  <Camera className="h-6 w-6 text-ethereal" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">Investigation Equipment</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Essential tools for detecting and documenting paranormal activity in Oklahoma
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipment.map((item, index) => (
                  <Card key={index} className="border-border/50 bg-background/50 hover:border-ethereal/30 transition-all">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ethereal/10">
                          <item.icon className="h-5 w-5 text-ethereal" />
                        </div>
                        <CardTitle className="text-lg font-heading">{item.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-ethereal mb-2">Purpose:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.purpose}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ethereal mb-2">Usage:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.usage}</p>
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
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ethereal/10">
                  <FileText className="h-6 w-6 text-ethereal" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">Documentation Best Practices</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Proper documentation is crucial for credible paranormal investigation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {documentation.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/40 hover:border-ethereal/30 transition-all">
                    <div className="h-8 w-8 rounded-lg bg-ethereal/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-ethereal">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-1">{item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ethereal/10">
                  <Shield className="h-6 w-6 text-ethereal" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">Safety Guidelines</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Your safety is paramount during paranormal investigations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safety.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/40 hover:border-ethereal/30 transition-all">
                    <AlertTriangle className="h-5 w-5 text-ethereal flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
