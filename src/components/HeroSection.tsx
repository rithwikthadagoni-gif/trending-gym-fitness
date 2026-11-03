import React from 'react';
import { ArrowDownRight, Compass, ShieldCheck } from 'lucide-react';
import { ThreeHeroPlate } from './ThreeHeroPlate.tsx';
import { GymConfig } from '../config/gymConfig.ts';

interface HeroSectionProps {
  config: GymConfig;
  onOpenInquiry: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onOpenInquiry }) => {
  return (
    <section className="relative w-full pt-8 pb-16 sm:pb-24 border-b border-[#20201E]/10 overflow-hidden">
      {/* Background Subtle Athletic Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#20201E 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Top Kicker - Anti-slop clean metadata */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[#20201E]/70 mb-4 tracking-wider uppercase">
          <span className="font-bold text-[#20201E]">{config.brandName}</span>
          <span aria-hidden="true">/</span>
          <span>EST. 2026</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#20201E]/90 font-medium">ATHLETIC STRENGTH SANCTUARY</span>
        </div>

        {/* 2-Column Split: Headline & Narrative on Left, 3D & Photography on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Editorial Athletic Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase leading-[0.88] text-[#20201E] mb-6 text-balance">
              {config.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#20201E]/80 max-w-xl mb-8 leading-relaxed font-sans">
              {config.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenInquiry}
                className="group px-7 py-3.5 bg-[#D0F05A] text-[#20201E] font-display font-bold text-base uppercase tracking-wider rounded hover:bg-[#c3e648] active:translate-y-0.5 shadow-sm flex items-center gap-2.5 transition-all"
              >
                <span>Join the Gym</span>
                <ArrowDownRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <a
                href="#facilities"
                className="px-6 py-3.5 bg-[#20201E]/5 hover:bg-[#20201E]/10 text-[#20201E] font-mono text-xs uppercase tracking-wider rounded border border-[#20201E]/15 flex items-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4 text-[#20201E]/70" />
                <span>Explore the Space</span>
              </a>
            </div>

            {/* Trust Assurance Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#20201E]/70 border-t border-[#20201E]/10 pt-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#20201E]" />
                <span>No commercial crowd bottlenecks</span>
              </div>
              <span aria-hidden="true" className="text-[#BDBBB4]">·</span>
              <div>Capped member capacity</div>
              <span aria-hidden="true" className="text-[#BDBBB4]">·</span>
              <div>Strict lifting etiquette</div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Plate + Hero Photography Frame */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* 3D Interactive Calibrated Weight Plate Canvas */}
            <div className="bg-[#20201E] rounded-xl p-2 relative overflow-hidden border border-[#20201E] shadow-lg">
              <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D0F05A]" />
                <span className="text-[11px] font-mono text-[#F5F1E8] uppercase tracking-wider">
                  Interactive Calibrated 3D Specimen
                </span>
              </div>
              <ThreeHeroPlate brandName={config.brandName} />
            </div>

            {/* Cinematic Editorial Photo Preview */}
            <div className="relative rounded-xl overflow-hidden border border-[#20201E]/15 group">
              <img
                src="/src/assets/images/gym_hero_editorial_1793721298497.jpg"
                alt="Gym strength floor with Olympic racks and chalk in morning light"
                className="w-full h-48 sm:h-56 object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20201E]/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs font-mono text-[#F5F1E8] flex items-center justify-between w-full">
                  <span>FACILITY ARENA A-1</span>
                  <span className="text-[#D0F05A]">DAWN SESSION SPEC</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4-Column KPI / Trust Strip in a full-width row below the hero split */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-[#20201E]/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {config.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-[#20201E] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-[#20201E] uppercase mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-[#20201E]/60 font-sans mt-0.5">
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
