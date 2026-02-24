import { Link } from '@tanstack/react-router';
import { Ghost, Eye, Radio, Zap, ArrowRight, Shield, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const services = [
    {
      icon: Ghost,
      title: 'Apparitions',
      description: 'Investigation of ghostly figures, shadow people, and full-body manifestations.',
    },
    {
      icon: Radio,
      title: 'Unexplained Sounds',
      description: 'Analysis of EVP, phantom footsteps, knocking, and disembodied voices.',
    },
    {
      icon: Eye,
      title: 'Moving Objects',
      description: 'Documentation of poltergeist activity and telekinetic phenomena.',
    },
    {
      icon: Zap,
      title: 'Electromagnetic Anomalies',
      description: 'Detection of unusual EMF readings and energy fluctuations.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Professional Investigation',
      description: 'Over 130 years of experience in paranormal research and documentation.',
    },
    {
      icon: BookOpen,
      title: 'Scientific Approach',
      description: 'We combine traditional methods with modern technology and rigorous analysis.',
    },
    {
      icon: Users,
      title: 'Confidential Service',
      description: 'Your privacy is paramount. All investigations are handled with discretion.',
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
                <Ghost className="h-4 w-4" />
                Since 1892
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Investigating the{' '}
              <span className="text-ethereal glow-text">Unexplained</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional paranormal investigation services. We document, analyze, and help you understand supernatural phenomena with scientific rigor and compassion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/submit-case">
                <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold group">
                  Report Activity
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/cases">
                <Button size="lg" variant="outline" className="border-ethereal/30 hover:bg-ethereal/10">
                  View Case Files
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
              Our <span className="text-ethereal">Specializations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We investigate a wide range of paranormal phenomena using state-of-the-art equipment and time-tested methodologies.
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
                About <span className="text-ethereal">Our Team</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1892, Spectral Investigations has been at the forefront of paranormal research for over a century. Our team combines traditional investigative techniques with cutting-edge technology to document and analyze unexplained phenomena.
                </p>
                <p>
                  We approach each case with scientific rigor, maintaining detailed records and using calibrated equipment to capture evidence. Our investigators are trained in both historical research and modern detection methods.
                </p>
                <p>
                  Whether you're experiencing unexplained sounds, seeing apparitions, or witnessing objects move on their own, we're here to help you understand what's happening and provide documentation of your experiences.
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
                Experiencing Something <span className="text-ethereal">Unexplained?</span>
              </CardTitle>
              <CardDescription className="text-base max-w-2xl mx-auto">
                Don't face the unknown alone. Our team is ready to investigate your case with professionalism, discretion, and expertise. Submit your report today.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/submit-case">
                <Button size="lg" className="bg-ethereal hover:bg-ethereal/90 text-background font-semibold">
                  Submit a Case Report
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
