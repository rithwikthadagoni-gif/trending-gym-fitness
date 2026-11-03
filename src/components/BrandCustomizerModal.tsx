import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw, Copy, Sparkles } from 'lucide-react';
import { GymConfig, defaultGymConfig } from '../config/gymConfig.ts';

interface BrandCustomizerModalProps {
  config: GymConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (newConfig: GymConfig) => void;
}

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  config,
  isOpen,
  onClose,
  onUpdateConfig,
}) => {
  const [brandName, setBrandName] = useState(config.brandName);
  const [headline, setHeadline] = useState(config.headline);
  const [phoneDisplay, setPhoneDisplay] = useState(config.contact.phoneDisplay);
  const [address, setAddress] = useState(config.contact.address);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      brandName: brandName.trim() || 'GYM / BRAND',
      headline: headline.trim() || 'BUILT BY DISCIPLINE.',
      contact: {
        ...config.contact,
        phoneDisplay: phoneDisplay.trim(),
        address: address.trim(),
      },
    });
    onClose();
  };

  const handleReset = () => {
    setBrandName(defaultGymConfig.brandName);
    setHeadline(defaultGymConfig.headline);
    setPhoneDisplay(defaultGymConfig.contact.phoneDisplay);
    setAddress(defaultGymConfig.contact.address);
    onUpdateConfig(defaultGymConfig);
  };

  const handleCopyCodeSnippet = () => {
    const snippet = `// In src/config/gymConfig.ts:
brandName: "${brandName.trim()}",
headline: "${headline.trim()}",
address: "${address.trim()}",
phoneDisplay: "${phoneDisplay.trim()}"`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F1E8] w-full max-w-xl rounded-2xl border border-[#20201E]/20 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#20201E] text-[#F5F1E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D0F05A] text-[#20201E] rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">
                STUDENT BRAND CUSTOMIZER
              </h3>
              <p className="text-xs font-mono text-[#BDBBB4]">
                PREVIEW CANDIDATE GYM NAMES IN REAL-TIME
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#BDBBB4] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <div className="p-4 bg-[#EFEBE0] rounded-xl border border-[#20201E]/10 text-xs font-sans text-[#20201E]/80 leading-relaxed">
            <strong className="text-[#20201E]">First-Year BTech Student Helper:</strong> Since you haven't finalized your gym's official name or address yet, you can test different names below. When you find the perfect one, click "Apply to Site" or copy the configuration to <code className="bg-white px-1.5 py-0.5 rounded text-[#20201E] font-mono">src/config/gymConfig.ts</code>.
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                Gym / Brand Name Placeholder
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. IRON VAULT, KINETIC ATHLETICS, TITAN CLUB"
                className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white font-display font-bold uppercase tracking-wider text-[#20201E]"
              />
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-mono text-[#8E8C85]">
                <span>Try ideas:</span>
                {['IRON VAULT', 'KINETIC CLUB', 'BLACK IRON SANCTUARY', 'ATHLETE LAB'].map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setBrandName(idea)}
                    className="underline text-[#20201E] hover:text-black"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                Hero Headline Concept
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white font-display font-bold uppercase tracking-wider text-[#20201E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                Display Phone Placeholder
              </label>
              <input
                type="text"
                value={phoneDisplay}
                onChange={(e) => setPhoneDisplay(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                Display Address Placeholder
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#20201E] text-[#D0F05A] font-display font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
              >
                Apply to Live Preview
              </button>

              <button
                type="button"
                onClick={handleCopyCodeSnippet}
                className="px-4 py-3 border border-[#20201E]/20 text-xs font-mono rounded-lg hover:bg-white flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Code!' : 'Copy Config Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 border border-[#20201E]/20 text-xs font-mono rounded-lg hover:bg-white flex items-center justify-center gap-1.5 text-[#8E8C85]"
                title="Reset to default GYM / BRAND placeholder"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
