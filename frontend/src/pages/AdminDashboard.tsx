import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, FileText, Search, MessageSquare, BarChart3 } from 'lucide-react';
import CasesManager from '../components/admin/CasesManager';

function InvestigationsTab() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <Search className="h-12 w-12 mx-auto mb-4 opacity-40" />
      <p>Investigations management coming soon.</p>
    </div>
  );
}

function TestimonialsTab() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-40" />
      <p>Testimonials management coming soon.</p>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-40" />
      <p>Analytics coming soon.</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('cases');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <ProtectedRoute requiredRole={UserRole.admin}>
      <div className="min-h-screen bg-background">
        {/* Admin Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-foreground">Admin Dashboard</span>
                {identity && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/cases">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Case Files</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="cases" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Cases
              </TabsTrigger>
              <TabsTrigger value="investigations" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                Investigations
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cases">
              <CasesManager />
            </TabsContent>
            <TabsContent value="investigations">
              <InvestigationsTab />
            </TabsContent>
            <TabsContent value="testimonials">
              <TestimonialsTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
