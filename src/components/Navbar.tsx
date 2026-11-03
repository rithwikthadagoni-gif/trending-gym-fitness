import React, { useState } from 'react';
import { Menu, X, Shield, User, Sliders } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  onOpenInquiry: (planName?: string) => void;
  onOpenMemberPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  onOpenInquiry,
  onOpenMemberPortal,
  onOpenAdminPortal,
  onOpenCustomizer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Facilities', href: '#facilities' },
    { label: 'Training', href: '#training' },
    { label: 'Memberships', href: '#memberships' },
    { label: 'Transformations', href: '#transformations' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Utility Bar for Student Founders to inspect & customize placeholder */}
      <div className="bg-[#20201E] text-[#BDBBB4] text-xs py-1.5 px-4 sm:px-8 border-b border-[#30302D]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D0F05A]" />
            <span className="text-[#F5F1E8] font-medium">BTech Student Project:</span>
            <span className="text-[#BDBBB4] hidden sm:inline">Active Placeholder Identity:</span>
            <span className="text-[#D0F05A] font-bold">"{brandName}"</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 text-[11px] font-mono text-[#D0F05A] hover:underline"
              title="Change gym name, address & phone placeholder"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize Brand Name</span>
            </button>
            <span className="text-[#40403C]" aria-hidden="true">|</span>
            <button
              onClick={onOpenAdminPortal}
              className="flex items-center gap-1 text-[11px] font-mono text-[#BDBBB4] hover:text-[#F5F1E8]"
              title="Open secure staff dashboard"
            >
              <Shield className="w-3 h-3 text-[#D0F05A]" />
              <span>Admin Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Header Contract */}
      <header className="sticky top-0 z-40 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#20201E]/10 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#20201E] uppercase whitespace-nowrap shrink-0 hover:opacity-90"
          >
            {brandName}
          </a>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#20201E]/80 tracking-wide uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#20201E] hover:underline underline-offset-8 decoration-2 decoration-[#D0F05A] transition-all whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + Member access */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenMemberPortal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-[#20201E] border border-[#20201E]/20 rounded hover:bg-[#20201E]/5 transition-colors whitespace-nowrap shrink-0"
              title="Member account sign-in & portal"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Portal</span>
            </button>

            <button
              onClick={() => onOpenInquiry()}
              className="px-5 py-2.5 text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-[#20201E] bg-[#D0F05A] hover:bg-[#c2e448] active:translate-y-0.5 rounded shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              Join the Gym
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#20201E] hover:bg-[#20201E]/5 rounded"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5F1E8] border-b border-[#20201E]/15 px-6 py-6 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-4 text-base font-display font-bold uppercase tracking-wider text-[#20201E]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#20201E]/10 hover:text-[#20201E] hover:pl-2 transition-all"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMemberPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono font-medium text-[#20201E] border border-[#20201E]/30 rounded bg-white"
                >
                  <User className="w-4 h-4" />
                  <span>Member Account Login</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono font-medium text-[#20201E] border border-[#20201E]/30 rounded bg-white"
                >
                  <Shield className="w-4 h-4 text-[#20201E]" />
                  <span>Admin & Moderation Desk</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
