import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { GymConfig } from '../config/gymConfig.ts';

interface FooterProps {
  config: GymConfig;
  onOpenInquiry: () => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenInquiry, onOpenAdminPortal }) => {
  return (
    <footer className="bg-[#20201E] text-[#F5F1E8] pt-16 pb-12 border-t border-[#30302D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#30302D]">
          
          {/* Brand Col */}
          <div className="md:col-span-5">
            <a
              href="/"
              className="text-3xl font-display font-black tracking-tight uppercase text-[#F5F1E8] block mb-3"
            >
              {config.brandName}
            </a>
            <p className="text-xs text-[#BDBBB4] font-sans max-w-sm leading-relaxed mb-6">
              A high-performance athletic strength club engineered for disciplined lifting, calibrated iron, and real human adaptation.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D0F05A]">
              <span className="w-2 h-2 rounded-full bg-[#D0F05A]" />
              <span>Admissions open for founding cohort</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#BDBBB4] mb-3">
              Explore Arena
            </div>
            <ul className="space-y-2 text-xs font-sans text-[#F5F1E8]/80">
              <li><a href="#facilities" className="hover:text-[#D0F05A] transition-colors">Equipment & Platforms</a></li>
              <li><a href="#training" className="hover:text-[#D0F05A] transition-colors">Training Curriculum</a></li>
              <li><a href="#memberships" className="hover:text-[#D0F05A] transition-colors">Membership Dues & Passes</a></li>
              <li><a href="#transformations" className="hover:text-[#D0F05A] transition-colors">Athlete Transformations</a></li>
              <li><a href="#contact" className="hover:text-[#D0F05A] transition-colors">Facility Location & Hours</a></li>
            </ul>
          </div>

          {/* Operating Hours & Admissions Contact */}
          <div className="md:col-span-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#BDBBB4] mb-3">
              Sanctuary Timings
            </div>
            <div className="text-xs font-sans text-[#F5F1E8]/80 space-y-1.5 mb-6">
              <div><strong>Weekdays:</strong> {config.contact.hours.weekdays}</div>
              <div><strong>Sundays:</strong> {config.contact.hours.sunday}</div>
              <div className="text-[#8E8C85] text-[11px] pt-1 font-mono">
                * Unrestricted platform access during operational hours
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenInquiry}
                className="px-4 py-2 bg-[#D0F05A] text-[#20201E] text-xs font-display font-bold uppercase rounded hover:bg-[#c2e448] transition-colors"
              >
                Inquire for Admission
              </button>
              <button
                onClick={onOpenAdminPortal}
                className="px-3 py-2 border border-[#BDBBB4]/30 text-xs font-mono text-[#BDBBB4] hover:text-white rounded"
              >
                Staff Desk
              </button>
            </div>
          </div>

        </div>

        {/* Sub-Footer / Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E8C85]">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© {new Date().getFullYear()} {config.brandName}. All rights reserved.</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="text-[#BDBBB4]">Built by First-Year BTech Students</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#8E8C85]">
            * All prices, phone numbers, and addresses shown are indicative project placeholders until commercial launch.
          </div>
        </div>

      </div>
    </footer>
  );
};
