import React from 'react';
import { Target, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { GymConfig } from '../config/gymConfig.ts';

interface AboutSectionProps {
  config: GymConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  const pillars = [
    {
      num: '01',
      title: 'No Commercial Distractions',
      desc: 'Most modern gyms are designed to sell memberships you never use. We built our floor around calibrated barbells, solid platforms, and dedicated training lanes for people who actually show up.',
      icon: Target
    },
    {
      num: '02',
      title: 'Biomechanics Over Fancy Gizmos',
      desc: 'Every piece of steel is selected for joint-friendly strength curves, heavy load stability, and genuine functional adaptation. No pseudo-fitness gimmicks.',
      icon: Flame
    },
    {
      num: '03',
      title: 'Recovery as a Non-Negotiable',
      desc: 'Progress happens in adaptation. Our integrated cedar wood infrared sauna and cold plunge therapy bay ensure your central nervous system recovers as hard as you lift.',
      icon: Sparkles
    }
  ];

  return (
    <section id="about" className="py-20 sm:py-28 border-b border-[#20201E]/10 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#20201E]/70 mb-2">
              FOUNDING ETHOS · {config.brandName}
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-[#20201E] tracking-tight leading-none">
              A SANCTUARY FOR THOSE WHO ACTUALLY TRAIN.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#20201E]/80 leading-relaxed font-sans">
            We started with a simple frustration: commercial health clubs filled with loud music, broken machines, and endless sales pitches. We decided to build the space we always wanted to train in.
          </p>
        </div>

        {/* Story & Facility Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Main Visual: Arena Architecture */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-[#20201E]/15 shadow-sm">
              <img
                src="/src/assets/images/gym_facility_arena_1793721298640.jpg"
                alt="Architectural strength training arena with sprint turf and Olympic platforms"
                className="w-full h-[380px] sm:h-[460px] object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20201E]/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center justify-between w-full text-xs font-mono text-[#F5F1E8]">
                  <span>MAIN STRENGTH ARENA & SPRINT TRACK</span>
                  <span className="text-[#D0F05A]">UNCOMPROMISING STANDARDS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 bg-[#EFEBE0] rounded-xl border border-[#20201E]/10">
              <div className="text-xs font-mono text-[#20201E]/60 uppercase tracking-wider mb-2">
                Core Code of the Floor
              </div>
              <p className="text-sm font-sans text-[#20201E] leading-relaxed mb-4">
                "Rerack every plate. Respect everyone's working set. Keep the chalk on your hands and the focus on your execution. We don't care what you squat on day one — we care that you show up on day one hundred."
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#20201E]/80">
                <CheckCircle2 className="w-4 h-4 text-[#20201E]" />
                <span>The Athlete Standard</span>
              </div>
            </div>

            <div className="space-y-4">
              {pillars.map((pillar) => (
                <div key={pillar.num} className="p-5 border border-[#20201E]/10 rounded-xl bg-white/50 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#8E8C85]">{pillar.num}</span>
                    <pillar.icon className="w-4 h-4 text-[#20201E]" />
                  </div>
                  <h3 className="text-base font-display font-bold uppercase text-[#20201E] tracking-tight mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#20201E]/75 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
