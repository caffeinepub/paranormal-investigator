import { Outlet, Link } from '@tanstack/react-router';
import { Ghost, Menu, X, Mail, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity group">
              <div className="relative">
                <img 
                  src="/assets/generated/logo-ghostbusters-style.dim_400x400.png" 
                  alt="Oklahoma Paranormal Investigations" 
                  className="h-20 w-auto transition-all group-hover:drop-shadow-[0_0_12px_oklch(var(--ethereal)/0.4)]"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-foreground/70 hover:text-ethereal transition-colors relative group py-2"
                  activeProps={{
                    className: 'text-ethereal',
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-ethereal to-spectral group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 hover:bg-accent"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <button
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-3 px-4 text-sm font-medium text-foreground/70 hover:text-ethereal hover:bg-accent/50 rounded-lg transition-colors"
                  activeProps={{
                    className: 'text-ethereal bg-accent/30',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ghost className="h-6 w-6 text-ethereal" />
                <h3 className="font-display text-xl font-bold text-ethereal">
                  Oklahoma Paranormal Investigations
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Founded in Oklahoma, 2025. We investigate paranormal phenomena exclusively within Oklahoma with scientific rigor, compassion, and an open mind.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-ethereal animate-pulse" />
                <span>Serving Oklahoma Since 2025</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-ethereal transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-muted-foreground group-hover:bg-ethereal transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-ethereal" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Contact Us</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have a paranormal experience in Oklahoma to report? We're here to help.
              </p>
              <a
                href="mailto:paranormal.oklahoma.investigate@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-ethereal hover:text-spectral transition-colors group"
              >
                <span className="break-all">paranormal.oklahoma.investigate@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Oklahoma Paranormal Investigations. All rights reserved.
            </p>
            <p>
              Built with <span className="text-ethereal">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ethereal hover:text-spectral transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
