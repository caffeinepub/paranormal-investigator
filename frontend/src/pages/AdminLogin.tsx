import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Ghost, Lock, Mail, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdmin } from '../hooks/useAdmin';
import { useActor } from '../hooks/useActor';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin } = useAdmin();
  const { actor } = useActor();
  const navigate = useNavigate();

  // If already admin, redirect to case files
  if (isAdmin) {
    navigate({ to: '/admin/cases' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter your PIN.');
      return;
    }

    setIsLoading(true);
    try {
      if (!actor) {
        setError('Unable to connect to the backend. Please try again.');
        return;
      }
      const isValid = await actor.verifyAdminCredentials(email.trim(), pin.trim());
      if (isValid) {
        login(email.trim());
        navigate({ to: '/admin/cases' });
      } else {
        setError('Invalid email or PIN. Access denied.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Login error:', message);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereal/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spectral/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-ethereal/10 border border-ethereal/20 flex items-center justify-center shadow-glow">
                <Ghost className="h-10 w-10 text-ethereal" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-ethereal/20 border border-ethereal/40 flex items-center justify-center">
                <Lock className="h-3 w-3 text-ethereal" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="font-display text-2xl text-foreground">Admin Access</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Oklahoma Paranormal Investigations — restricted area
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Admin Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-border/60 focus:border-ethereal/60 focus:ring-ethereal/20"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm font-medium text-foreground/80">
                PIN
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-10 bg-background/50 border-border/60 focus:border-ethereal/60 focus:ring-ethereal/20"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-ethereal hover:bg-ethereal/90 text-background font-semibold shadow-glow hover:shadow-glow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Access is restricted to the site owner only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
