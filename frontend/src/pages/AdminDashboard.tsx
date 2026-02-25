import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Ghost, LogOut, BarChart3, FileSearch, Users, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '../hooks/useAdmin';
import InvestigationsManager from '../components/admin/InvestigationsManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import TeamManager from '../components/admin/TeamManager';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';

export default function AdminDashboard() {
  const { isAdmin, adminEmail, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ethereal/10 border border-ethereal/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-ethereal" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Oklahoma Paranormal Investigations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-ethereal/40 bg-ethereal/10 text-ethereal hidden sm:flex">
                <Ghost className="h-3 w-3 mr-1" />
                {adminEmail}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-border/60 hover:border-destructive/50 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Atmospheric background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereal/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spectral/3 rounded-full blur-3xl" />
        </div>

        <Tabs defaultValue="investigations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-card/50 backdrop-blur-sm p-1 border border-border/50">
            <TabsTrigger
              value="investigations"
              className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal py-3"
            >
              <FileSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Investigations</span>
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal py-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal py-3"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="gap-2 data-[state=active]:bg-ethereal/20 data-[state=active]:text-ethereal py-3"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investigations">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Investigations</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage all paranormal investigation records</p>
              </div>
              <InvestigationsManager />
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Testimonials</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage client testimonials and reviews</p>
              </div>
              <TestimonialsManager />
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Team Members</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your investigation team roster</p>
              </div>
              <TeamManager />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Analytics</h2>
                <p className="text-sm text-muted-foreground mt-1">Monitor site visits and form submissions</p>
              </div>
              <AnalyticsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
