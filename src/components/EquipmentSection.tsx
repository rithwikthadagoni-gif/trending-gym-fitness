import React, { useState } from 'react';
import { Dumbbell, Activity, ShieldCheck, HeartPulse, Check } from 'lucide-react';
import { GymConfig } from '../config/gymConfig.ts';

interface EquipmentSectionProps {
  config: GymConfig;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'training'>('equipment');

  const equipmentCategories = [
    {
      category: 'Olympic Lifting & Calibrated Plates',
      specs: [
        'Competition spec stainless steel 20kg & 15kg barbells',
        'Calibrated steel weight plates (tested within +/- 10g tolerance)',
        'Solid oak and high-density vulcanized rubber drop platforms',
        'Magnesium carbonate chalk basins at all power stations'
      ],
      image: '/src/assets/images/gym_equipment_macro_1793721299225.jpg',
      label: 'PRECISION KNURLING & CALIBRATION'
    },
    {
      category: 'Power Racks & Heavy Free Weights',
      specs: [
        'Commercial 3x3" 11-gauge matte steel power cages with band pegs',
        'Solid steel dumbbell lineup ranging from 2.5kg to 60kg pairs',
        'Independent safety spotter arms and monolift attachments',
        'Heavy-duty adjustable benches tested to 500kg static load'
      ],
      image: '/src/assets/images/gym_facility_arena_1793721298640.jpg',
      label: 'HEAVY STEEL FABRICATION'
    },
    {
      category: 'Contrast Recovery & Sauna Suite',
      specs: [
        'Custom cedar wood dry infrared sauna (operational up to 90°C)',
        'Industrial chiller-controlled cold plunge bath (maintained at 4°C)',
        'Percussive massage & targeted tissue recovery lounge',
        'Contrast protocol consultation for nervous system regeneration'
      ],
      image: '/src/assets/images/gym_recovery_suite_1793721301048.jpg',
      label: 'CENTRAL NERVOUS SYSTEM REPAIR'
    }
  ];

  const trainingDisciplines = [
    {
      num: '01',
      title: 'Powerlifting & Barbell Strength',
      focus: 'Squat, Bench, Deadlift, Overhead Press',
      desc: 'Progressive overload protocols focused on raw strength, motor recruitment, and barbell mechanics without unnecessary complexity.',
      icon: Dumbbell
    },
    {
      num: '02',
      title: 'Functional Hypertrophy & Body Recomposition',
      focus: 'Tension, Volume, Muscle Balance',
      desc: 'Smart mechanical tension training utilizing dumbbells, cables, and plate-loaded machines to build dense, functional muscle without joint wear.',
      icon: Activity
    },
    {
      num: '03',
      title: 'Speed, Turf & Conditioning',
      focus: 'Sprint Mechanics, Sleds, Heart Rate Zones',
      desc: 'High-output athletic sessions on our 30-meter turf utilizing weighted sleds, skiergs, and rowers for metabolic capacity.',
      icon: HeartPulse
    },
    {
      num: '04',
      title: 'Mobility & Structural Health',
      focus: 'Joint Health, Thoracic Mobility, Scapular Control',
      desc: 'Pre-hab and active mobility work integrated into every lifting routine to prevent injury and keep your joints moving freely.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="facilities" className="py-20 sm:py-28 border-b border-[#20201E]/10 bg-[#EFEBE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#20201E]/70 mb-2">
              ARSENAL & CURRICULUM · {config.brandName}
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-[#20201E] tracking-tight leading-none">
              EQUIPMENT & DISCIPLINES
            </h2>
          </div>

          {/* Interactive Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-[#20201E]/10 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                activeTab === 'equipment'
                  ? 'bg-[#20201E] text-[#D0F05A]'
                  : 'text-[#20201E]/80 hover:text-[#20201E]'
              }`}
            >
              Equipment Showcase
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                activeTab === 'training'
                  ? 'bg-[#20201E] text-[#D0F05A]'
                  : 'text-[#20201E]/80 hover:text-[#20201E]'
              }`}
            >
              Training Disciplines
            </button>
          </div>
        </div>

        {/* View 1: Equipment Showcase */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {equipmentCategories.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F5F1E8] rounded-xl border border-[#20201E]/15 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.category}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#20201E]/90 text-[#F5F1E8] text-[10px] font-mono px-2 py-1 rounded">
                      {item.label}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold uppercase text-[#20201E] tracking-tight mb-4">
                      {item.category}
                    </h3>
                    <ul className="space-y-2.5">
                      {item.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5 text-xs text-[#20201E]/80 font-sans">
                          <Check className="w-3.5 h-3.5 text-[#20201E] shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#20201E]/10 text-[11px] font-mono text-[#8E8C85]">
                  STANDARDS: ISO & OLYMPIC CALIBRATED
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 2: Training Disciplines */}
        {activeTab === 'training' && (
          <div id="training" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {trainingDisciplines.map((item) => (
              <div
                key={item.num}
                className="p-6 bg-[#F5F1E8] rounded-xl border border-[#20201E]/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#8E8C85]">{item.num}</span>
                    <item.icon className="w-5 h-5 text-[#20201E]" />
                  </div>
                  <h3 className="text-xl font-display font-bold uppercase text-[#20201E] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#20201E]/70 mb-3 uppercase tracking-wider">
                    {item.focus}
                  </div>
                  <p className="text-xs text-[#20201E]/80 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#20201E]/10 text-[11px] font-mono text-[#20201E]/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D0F05A] border border-[#20201E]" />
                  <span>Coach guided programming</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
