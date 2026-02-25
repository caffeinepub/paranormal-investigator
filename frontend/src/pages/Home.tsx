import { Link } from '@tanstack/react-router';
import { Ghost, Eye, Radio, Zap, ArrowRight, Shield, BookOpen, Users, MapPin, Mail, Sparkles, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const services = [
    {
      icon: Ghost,
      title: 'Apparitions',
      description: 'Investigation of ghostly figures, shadow people, and full-body manifestations throughout Oklahoma.',
      color: 'text-ethereal',
    },
    {
      icon: Radio,
      title: 'Unexplained Sounds',
      description: 'Analysis of EVP, phantom footsteps, knocking, and disembodied voices in Oklahoma locations.',
      color: 'text-spectral',
    },
    {
      icon: Eye,
      title: 'Moving Objects',
      description: 'Documentation of poltergeist activity and telekinetic phenomena across Oklahoma.',
      color: 'text-phantom',
    },
    {
      icon: Zap,
      title: 'Electromagnetic Anomalies',
      description: 'Detection of unusual EMF readings and energy fluctuations in Oklahoma properties.',
      color: 'text-ethereal',
    },
  ];

  const features = [
    {
      icon: Award,
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

  const stats = [
    { label: 'Investigations', value: '25+', icon: Ghost },
    { label: 'Years Experience', value: '1', icon: Clock },
    { label: 'Oklahoma Cities', value: '15+', icon: MapPin },
    { label: 'Success Rate', value: '95%', icon: Award },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-paranormal.dim_1920x1080.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereal/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spectral/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 lg:px-6 py-24 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-block">
              <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal backdrop-blur-sm px-4 py-2 text-sm font-medium">
                <MapPin className="h-4 w-4 mr-2" />
                Oklahoma • Founded 2025
              </Badge>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-tight">
              Oklahoma's Premier{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ethereal via-spectral to-phantom glow-text">
                Paranormal Investigators
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional paranormal investigation services exclusively in Oklahoma. We document, analyze, and help you understand supernatural phenomena with scientific rigor and compassion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a href="mailto:paranormal.oklahoma.investigate@gmail.com">
                <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold group shadow-glow hover:shadow-glow-lg transition-all text-base px-8 py-6">
                  Contact Us
                  <Mail className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="border-ethereal/40 hover:bg-ethereal/10 hover:border-ethereal/60 transition-all text-base px-8 py-6">
                  View Resources
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ethereal/10 text-ethereal mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold text-ethereal">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 lg:px-6">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal">
              <Sparkles className="h-3 w-3 mr-2" />
              Our Expertise
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              Oklahoma <span className="text-ethereal">Specializations</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              We investigate a wide range of paranormal phenomena throughout Oklahoma using state-of-the-art equipment and time-tested methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-ethereal/40 transition-all duration-300 hover:shadow-lg hover:shadow-ethereal/10 group"
              >
                <CardHeader className="space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ethereal/10 group-hover:bg-ethereal/20 transition-colors">
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-heading">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 gradient-ethereal">
        <div className="container px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="border-ethereal/40 bg-background/50 text-ethereal backdrop-blur-sm">
              <Ghost className="h-3 w-3 mr-2" />
              About Us
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Dedicated to Understanding the <span className="text-ethereal">Unknown</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in 2025, Spectral Investigations is Oklahoma's premier paranormal investigation team. We bring scientific methodology and compassionate understanding to every case.
              </p>
              <p>
                Our team combines years of experience with cutting-edge technology to document and analyze unexplained phenomena across Oklahoma. We approach each investigation with an open mind and a commitment to finding the truth.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm">
                    <feature.icon className="h-6 w-6 text-ethereal" />
                  </div>
                  <h3 className="font-heading text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 lg:px-6">
          <Card className="border-ethereal/30 bg-gradient-to-br from-card via-card to-ethereal/5 shadow-glow">
            <CardContent className="p-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ethereal/10 mb-4">
                <Ghost className="h-8 w-8 text-ethereal" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
                Experiencing Something <span className="text-ethereal">Unexplained</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Don't face the unknown alone. Our team is ready to help you understand and document your paranormal experience anywhere in Oklahoma.
              </p>
              <div className="pt-4">
                <a href="mailto:paranormal.oklahoma.investigate@gmail.com">
                  <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold group shadow-glow hover:shadow-glow-lg transition-all text-base px-8 py-6">
                    Contact Us Today
                    <Mail className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
