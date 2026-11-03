import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle, Clock } from 'lucide-react';
import { Transformation } from '../../server.ts';

interface TransformationsSectionProps {
  transformations: Transformation[];
  onOpenSubmissionModal: () => void;
}

export const TransformationsSection: React.FC<TransformationsSectionProps> = ({
  transformations,
  onOpenSubmissionModal,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const currentItem = transformations[activeStoryIndex] || transformations[0];

  return (
    <section id="transformations" className="py-20 sm:py-28 border-b border-[#20201E]/10 bg-[#EFEBE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#20201E]/70 mb-2">
              ATHLETE LOGS · CONSENT-VERIFIED PROOF
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-[#20201E] tracking-tight leading-none">
              MEMBER PROGRESSION
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSubmissionModal}
              className="px-4 py-2.5 bg-[#20201E] text-[#D0F05A] hover:bg-[#141413] rounded text-xs font-mono font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Transformation (Consent Required)</span>
            </button>
          </div>
        </div>

        {/* Legal & Consent Notice Banner */}
        <div className="mb-10 p-4 bg-[#F5F1E8] rounded-xl border border-[#20201E]/15 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#20201E] shrink-0 mt-0.5" />
          <div className="text-xs text-[#20201E]/80 font-sans leading-relaxed">
            <strong className="text-[#20201E] font-medium">Consent & Privacy Governance:</strong> Photos displayed here are published solely with signed member authorization. We do not use fake stock models or fabricate body fat statistics. Every entry is archived with signed verification records in our admin desk.
          </div>
        </div>

        {/* Main Progression Spotlight */}
        {currentItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
            
            {/* Visual Comparison Frame */}
            <div className="lg:col-span-7 bg-[#20201E] rounded-2xl overflow-hidden p-3 border border-[#20201E] flex flex-col justify-between">
              
              <div className="grid grid-cols-2 gap-3 h-full min-h-[320px] sm:min-h-[420px]">
                
                {/* Milestone 1 (Foundation) */}
                <div className="relative rounded-xl overflow-hidden bg-[#141413] group">
                  <img
                    src={currentItem.beforePhotoUrl}
                    alt={`${currentItem.memberName} Baseline`}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#20201E]/90 text-[#F5F1E8] text-[10px] font-mono px-2 py-1 rounded">
                    DAY 01 BASELINE
                  </div>
                </div>

                {/* Milestone 2 (Progression) */}
                <div className="relative rounded-xl overflow-hidden bg-[#141413] group">
                  <img
                    src={currentItem.afterPhotoUrl}
                    alt={`${currentItem.memberName} Progression`}
                    className="w-full h-full object-cover contrast-110 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#D0F05A] text-[#20201E] text-[10px] font-mono font-bold px-2 py-1 rounded">
                    MONTH 0{currentItem.durationMonths} ADAPTATION
                  </div>
                </div>

              </div>

              {/* Bottom Spec Footer */}
              <div className="mt-3 pt-3 border-t border-[#30302D] flex items-center justify-between text-[11px] font-mono text-[#BDBBB4] px-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D0F05A]" />
                  <span>CONSENT SIGNED: {currentItem.consentDate || 'CONFIRMED'}</span>
                </span>
                <span className="text-[#8E8C85]">VERIFIED GYM ATTENDANCE</span>
              </div>

            </div>

            {/* Narrative & Details Card */}
            <div className="lg:col-span-5 bg-[#F5F1E8] rounded-2xl border border-[#20201E]/15 p-6 sm:p-8 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#20201E]/60">
                    ATHLETE LOG #{currentItem.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#20201E] bg-[#EFEBE0] px-2.5 py-1 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentItem.durationMonths} Months Discipline</span>
                  </div>
                </div>

                <h3 className="text-3xl font-display font-black uppercase text-[#20201E] tracking-tight mb-2">
                  {currentItem.anonymousLabel || currentItem.memberName}
                </h3>

                <div className="text-xs font-mono text-[#20201E]/80 uppercase tracking-wider mb-6 pb-4 border-b border-[#20201E]/10">
                  Focus: {currentItem.focusArea}
                </div>

                <div className="text-sm font-sans text-[#20201E] leading-relaxed mb-6">
                  "{currentItem.story}"
                </div>

                <div className="space-y-2.5 pt-4 border-t border-[#20201E]/10 text-xs font-sans text-[#20201E]/75">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20201E]" />
                    <span>Barbell technique re-education</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20201E]" />
                    <span>Post-session contrast sauna & cold plunge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20201E]" />
                    <span>Calibrated linear progression cycle</span>
                  </div>
                </div>
              </div>

              {/* Selector Tabs */}
              <div className="mt-8 pt-6 border-t border-[#20201E]/10">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#20201E]/60 mb-2">
                  Select Athlete Progression Log:
                </div>
                <div className="flex flex-wrap gap-2">
                  {transformations.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveStoryIndex(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                        activeStoryIndex === idx
                          ? 'bg-[#20201E] text-[#D0F05A]'
                          : 'bg-[#EFEBE0] text-[#20201E] hover:bg-[#E4E0D6]'
                      }`}
                    >
                      {item.anonymousLabel || item.memberName}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-sm font-mono text-[#8E8C85] bg-white rounded-xl border border-[#20201E]/10">
            No approved transformation records currently queued for public release.
          </div>
        )}

      </div>
    </section>
  );
};
