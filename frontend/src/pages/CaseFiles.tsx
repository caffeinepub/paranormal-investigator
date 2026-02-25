import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from '../contexts/AdminContext';
import CasesManager from '../components/admin/CasesManager';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../backend';
import { Shield, LayoutDashboard, LogOut, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CaseFiles() {
  const { clear } = useInternetIdentity();
  const { logout: adminLogout } = useAdminContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear both PIN session and Internet Identity session
    adminLogout();
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <ProtectedRoute requiredRole={UserRole.admin}>
      <div className="min-h-screen bg-background">
        {/* Admin Header Bar */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-foreground">Case Files</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/cases">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Cases Page</span>
                  </Button>
                </Link>
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
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

        {/* Cases Manager */}
        <div className="container mx-auto px-4 py-8">
          <CasesManager />
        </div>
      </div>
    </ProtectedRoute>
  );
}
