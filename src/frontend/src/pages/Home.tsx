import { Link } from '@tanstack/react-router';
import { Ghost, Eye, Radio, Zap, ArrowRight, Shield, BookOpen, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const services = [
    {
      icon: Ghost,
      title: 'Apparitions',
      description: 'Investigation of ghostly figures, shadow people, and full-body manifestations throughout Oklahoma.',
    },
    {
      icon: Radio,
      title: 'Unexplained Sounds',
      description: 'Analysis of EVP, phantom footsteps, knocking, and disembodied voices in Oklahoma locations.',
    },
    {
      icon: Eye,
      title: 'Moving Objects',
      description: 'Documentation of poltergeist activity and telekinetic phenomena across Oklahoma.',
    },
    {
      icon: Zap,
      title: 'Electromagnetic Anomalies',
      description: 'Detection of unusual EMF readings and energy fluctuations in Oklahoma properties.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Professional Investigation',
      description: '1 year of dedicated experience investigating paranormal activity exclusively in Oklahoma.',
    },
    {
      icon: BookOpen,
      title: 'Scientific Approach',
      description: 'We combine traditional methods with modern technology and rigorous analysis.',
    },
    {
      icon: Users,
      title: 'Confidential Service',
      description: 'Your privacy is paramount. All Oklahoma investigations are handled with discretion.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-paranormal.dim_1920x1080.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-ethereal/30 bg-ethereal/10 px-4 py-1.5 text-sm font-medium text-ethereal backdrop-blur">
                <MapPin className="h-4 w-4" />
                Oklahoma Only • Founded 2025
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Oklahoma's Premier{' '}
              <span className="text-ethereal glow-text">Paranormal Investigators</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional paranormal investigation services exclusively in Oklahoma. We document, analyze, and help you understand supernatural phenomena with scientific rigor and compassion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/submit-case">
                <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold group">
                  Report Oklahoma Activity
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/cases">
                <Button size="lg" variant="outline" className="border-ethereal/30 hover:bg-ethereal/10">
                  View Oklahoma Cases
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Oklahoma <span className="text-ethereal">Specializations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We investigate a wide range of paranormal phenomena throughout Oklahoma using state-of-the-art equipment and time-tested methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-border/40 bg-card/50 backdrop-blur hover:border-ethereal/30 transition-all duration-300 hover:shadow-lg hover:shadow-ethereal/10">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-ethereal/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-ethereal" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-ethereal">Our Oklahoma Team</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025, Spectral Investigations is Oklahoma's dedicated paranormal investigation service with a passionate team of 2+ investigators. We exclusively serve Oklahoma communities, building our expertise by combining traditional investigative techniques with cutting-edge technology to document and analyze unexplained phenomena across the state.
                </p>
                <p>
                  With 1 year of hands-on experience investigating Oklahoma locations, we approach each case with scientific rigor, maintaining detailed records and using calibrated equipment to capture evidence. Our investigators are trained in both historical research and modern detection methods, with special knowledge of Oklahoma's unique paranormal landscape.
                </p>
                <p>
                  Whether you're experiencing unexplained sounds, seeing apparitions, or witnessing objects move on their own anywhere in Oklahoma, we're here to help you understand what's happening and provide documentation of your experiences. We only investigate cases within Oklahoma state boundaries.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-ethereal/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-ethereal" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <Card className="border-ethereal/30 bg-gradient-to-br from-ethereal/5 to-midnight/20 backdrop-blur">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-display text-3xl md:text-4xl font-bold mb-4">
                Experiencing Something <span className="text-ethereal">Unexplained in Oklahoma?</span>
              </CardTitle>
              <CardDescription className="text-base max-w-2xl mx-auto">
                Don't face the unknown alone. Our Oklahoma-based team is ready to investigate your case with professionalism, discretion, and expertise. We only accept cases within Oklahoma state boundaries. Submit your report today.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/submit-case">
                <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold">
                  Submit an Oklahoma Case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
