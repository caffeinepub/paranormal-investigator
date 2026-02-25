import { useEffect } from 'react';
import { Ghost, Sparkles, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '../hooks/useAnalytics';

const defaultTeam = [
  {
    name: 'Dr. Elena Blackwood',
    role: 'Lead Investigator & Founder',
    bio: 'With a background in physics and a lifelong fascination with the unexplained, Dr. Blackwood founded Oklahoma Paranormal Investigations in 2025. She brings rigorous scientific methodology to every case, ensuring all findings are thoroughly documented and analyzed.',
    specialties: ['EMF Analysis', 'EVP Research', 'Case Documentation'],
    image: '/assets/generated/investigator-1.dim_400x400.png',
  },
  {
    name: 'Marcus Chen',
    role: 'Technical Specialist',
    bio: 'Marcus is our technology expert, responsible for maintaining and operating our advanced detection equipment. His background in electrical engineering allows him to distinguish genuine anomalies from equipment artifacts, ensuring the integrity of our investigations.',
    specialties: ['Equipment Operation', 'Data Analysis', 'Thermal Imaging'],
    image: '/assets/generated/investigator-2.dim_400x400.png',
  },
];

export default function Team() {
  const { trackPageVisit } = useAnalytics();

  useEffect(() => {
    trackPageVisit('Team');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereal/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spectral/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="container px-4 lg:px-6 relative z-10 text-center space-y-6">
          <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal">
            <Users className="h-3 w-3 mr-2" />
            Our Team
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-ethereal via-spectral to-phantom glow-text">Investigators</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Our dedicated team of paranormal researchers brings expertise, passion, and scientific rigor to every Oklahoma investigation.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-background">
        <div className="container px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {defaultTeam.map((member, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-ethereal/40 transition-all duration-300 hover:shadow-lg hover:shadow-ethereal/10 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{member.name}</h2>
                    <p className="text-ethereal font-medium mt-1">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((spec, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-ethereal/30 bg-ethereal/5 text-ethereal text-xs"
                        >
                          <Star className="h-2.5 w-2.5 mr-1" />
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Mission */}
      <section className="py-20 gradient-ethereal">
        <div className="container px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="border-ethereal/40 bg-background/50 text-ethereal backdrop-blur-sm">
              <Ghost className="h-3 w-3 mr-2" />
              Our Mission
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Committed to <span className="text-ethereal">Truth</span> and <span className="text-spectral">Discovery</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe every unexplained experience deserves a thorough, respectful investigation. Our team is dedicated to providing Oklahoma residents with honest answers and professional service.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: '25+', label: 'Investigations' },
                { value: '15+', label: 'Oklahoma Cities' },
                { value: '95%', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="font-display text-3xl md:text-4xl font-bold text-ethereal glow-text-subtle">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sparkles CTA */}
      <section className="py-16 bg-background">
        <div className="container px-4 lg:px-6 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ethereal/10 border border-ethereal/20">
            <Sparkles className="h-8 w-8 text-ethereal" />
          </div>
          <h2 className="font-display text-3xl font-bold">Join Our Investigation</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Interested in paranormal research? We're always looking for dedicated individuals to join our Oklahoma team.
          </p>
          <a
            href="mailto:paranormal.oklahoma.investigate@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-ethereal hover:bg-ethereal/90 text-background font-semibold shadow-glow hover:shadow-glow-lg transition-all"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
