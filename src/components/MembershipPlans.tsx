import React from 'react';
import { Check, X, ShieldAlert, ArrowRight, CreditCard } from 'lucide-react';
import { Plan } from '../../server.ts';

interface MembershipPlansProps {
  plans: Plan[];
  onSelectPlanForInquiry: (planName: string) => void;
  onInitiatePaymentSandbox: (plan: Plan) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({
  plans,
  onSelectPlanForInquiry,
  onInitiatePaymentSandbox,
}) => {
  return (
    <section id="memberships" className="py-20 sm:py-28 border-b border-[#20201E]/10 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header & Transparency Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#20201E]/70 mb-2">
              ADMISSIONS & ACCESS · TRANSPARENT PRICING
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-[#20201E] tracking-tight leading-none">
              MEMBERSHIP TIERS
            </h2>
          </div>

          {/* Explicit Placeholder Price Banner */}
          <div className="p-3 bg-[#EFEBE0] border border-[#20201E]/15 rounded-lg max-w-md flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#20201E] shrink-0 mt-0.5" />
            <div className="text-xs font-sans text-[#20201E]/80">
              <strong className="text-[#20201E]">Placeholder Notice:</strong> Listed rates are sample benchmarks. Exact founding member dues will be locked in once the facility opens.
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col justify-between transition-all ${
                  isPopular
                    ? 'bg-[#20201E] text-[#F5F1E8] border-[#20201E] shadow-xl ring-2 ring-[#D0F05A]'
                    : 'bg-white text-[#20201E] border-[#20201E]/15 hover:border-[#20201E]/40'
                }`}
              >
                {/* Popular Accent Marker */}
                {isPopular && (
                  <div className="absolute -top-3 left-6 bg-[#D0F05A] text-[#20201E] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm">
                    Most Popular Commitment
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-display font-bold uppercase tracking-tight ${isPopular ? 'text-[#F5F1E8]' : 'text-[#20201E]'}`}>
                      {plan.name}
                    </h3>
                    <span className="text-[11px] font-mono uppercase opacity-70">
                      /{plan.period}
                    </span>
                  </div>

                  <p className={`text-xs mb-6 leading-relaxed font-sans ${isPopular ? 'text-[#BDBBB4]' : 'text-[#20201E]/70'}`}>
                    {plan.description}
                  </p>

                  {/* Price Tag with Placeholder Warning */}
                  <div className="mb-6 pb-6 border-b border-current/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-mono opacity-80">₹</span>
                      <span className="text-4xl sm:text-5xl font-display font-black tracking-tight tabular-nums">
                        {plan.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono opacity-60">
                        {plan.period === 'session' ? '/entry' : `/${plan.period}`}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono opacity-60">
                      * Indicative rate — includes GST
                    </div>
                  </div>

                  {/* Included Features */}
                  <div className="mb-6 space-y-2.5">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 mb-2">
                      Included Access
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs font-sans">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? 'text-[#D0F05A]' : 'text-[#20201E]'}`} />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Excluded Items */}
                  {plan.exclusions && plan.exclusions.length > 0 && (
                    <div className="mb-6 space-y-2 pt-2 border-t border-current/10 opacity-70">
                      <div className="text-[10px] font-mono uppercase tracking-wider">
                        Not Included
                      </div>
                      {plan.exclusions.map((excl, eIdx) => (
                        <div key={eIdx} className="flex items-start gap-2 text-[11px] font-sans">
                          <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                          <span className="leading-snug">{excl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="pt-4 space-y-2 border-t border-current/10">
                  <button
                    onClick={() => onSelectPlanForInquiry(plan.name)}
                    className={`w-full py-2.5 px-4 rounded text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isPopular
                        ? 'bg-[#D0F05A] text-[#20201E] hover:bg-[#c3e648]'
                        : 'bg-[#20201E] text-[#F5F1E8] hover:bg-[#141413]'
                    }`}
                  >
                    <span>Inquire for Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onInitiatePaymentSandbox(plan)}
                    className={`w-full py-2 px-3 rounded text-[11px] font-mono flex items-center justify-center gap-1.5 border transition-colors ${
                      isPopular
                        ? 'border-white/20 text-[#F5F1E8] hover:bg-white/10'
                        : 'border-[#20201E]/20 text-[#20201E] hover:bg-[#20201E]/5'
                    }`}
                    title="Preview secure payment integration"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Test Sandbox Checkout</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Plan Terms & FAQ Strip */}
        <div className="mt-12 p-6 bg-[#EFEBE0] rounded-xl border border-[#20201E]/15 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans text-[#20201E]/80">
          <div>
            <strong className="block text-[#20201E] font-mono uppercase mb-1">Capped Membership</strong>
            We limit total active passes to guarantee zero queueing for calibrated racks and platforms.
          </div>
          <div>
            <strong className="block text-[#20201E] font-mono uppercase mb-1">Freeze Policy</strong>
            Quarterly and Annual members can freeze memberships up to 30 days for exam cycles or travel.
          </div>
          <div>
            <strong className="block text-[#20201E] font-mono uppercase mb-1">No Lock-in Contracts</strong>
            Monthly passes are month-to-month. No cancellation penalties or auto-renewal traps.
          </div>
        </div>

      </div>
    </section>
  );
};
