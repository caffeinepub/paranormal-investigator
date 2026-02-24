import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Ghost, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cases', label: 'Case Gallery' },
    { path: '/submit-case', label: 'Report Activity' },
    { path: '/resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/generated/logo-investigation-team.dim_256x256.png" 
                alt="Paranormal Investigation Team" 
                className="h-10 w-10 rounded-full ring-2 ring-ethereal/30"
              />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-ethereal">
                  Spectral Investigations
                </span>
                <span className="text-xs text-muted-foreground font-mono">Est. 1892</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-foreground/80 hover:text-ethereal transition-colors relative group"
                  activeProps={{
                    className: 'text-ethereal',
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ethereal group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/40">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-sm font-medium text-foreground/80 hover:text-ethereal transition-colors"
                  activeProps={{
                    className: 'text-ethereal',
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
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-display text-lg font-bold mb-3 text-ethereal flex items-center gap-2">
                <Ghost className="h-5 w-5" />
                Spectral Investigations
              </h3>
              <p className="text-sm text-muted-foreground">
                Documenting the unexplained since 1892. We investigate paranormal phenomena with scientific rigor and an open mind.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg font-bold mb-3 text-ethereal">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-ethereal transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-lg font-bold mb-3 text-ethereal">Contact</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Have a paranormal experience to report?
              </p>
              <button
                onClick={() => navigate({ to: '/submit-case' })}
                className="text-sm text-ethereal hover:underline"
              >
                Submit a Case →
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Spectral Investigations. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ethereal hover:underline"
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
