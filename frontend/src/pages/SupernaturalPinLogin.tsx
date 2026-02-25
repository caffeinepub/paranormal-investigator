import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Eye, EyeOff, Ghost } from 'lucide-react';
import { useAdminContext } from '../contexts/AdminContext';

const ADMIN_PIN = '022025';
const ADMIN_EMAIL = 'supernatural@okpi.local';

export default function SupernaturalPinLogin() {
  const navigate = useNavigate();
  // Use AdminContext directly to avoid any hook indirection issues
  const { login, isAdmin } = useAdminContext();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // If already authenticated as admin, redirect immediately
  if (isAdmin) {
    navigate({ to: '/admin/dashboard' });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.trim() === ADMIN_PIN) {
      setError('');
      // Synchronously persist session to both storages and update React state
      login(ADMIN_EMAIL);
      // Navigate immediately — ProtectedRoute reads from storage synchronously
      navigate({ to: '/admin/dashboard' });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(
        newAttempts >= 3
          ? 'Access denied. Too many failed attempts.'
          : 'Invalid PIN. Access denied.'
      );
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-ethereal/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-spectral/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ethereal/10 border border-ethereal/30 mb-4">
              <Ghost className="w-8 h-8 text-ethereal" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">
              Restricted Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your authorization PIN to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 block">
                Authorization PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  maxLength={10}
                  autoFocus
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ethereal/50 focus:border-ethereal/50 transition-all text-center text-xl tracking-[0.5em] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pin.length === 0}
              className="w-full bg-ethereal hover:bg-ethereal/90 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Authenticate</span>
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-xs text-muted-foreground/50 mt-6">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
