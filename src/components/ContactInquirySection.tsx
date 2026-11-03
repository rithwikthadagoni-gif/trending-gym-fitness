import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, Send, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GymConfig } from '../config/gymConfig.ts';
import { Plan } from '../../server.ts';

interface ContactInquirySectionProps {
  config: GymConfig;
  plans: Plan[];
  selectedPlanPreload?: string;
  onInquirySubmitted: () => void;
}

export const ContactInquirySection: React.FC<ContactInquirySectionProps> = ({
  config,
  plans,
  selectedPlanPreload,
  onInquirySubmitted,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(selectedPlanPreload || 'Quarterly All-Access');
  const [message, setMessage] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{ id: string; message: string } | null>(null);

  // Update selected plan if prop changes
  React.useEffect(() => {
    if (selectedPlanPreload) {
      setSelectedPlan(selectedPlanPreload);
    }
  }, [selectedPlanPreload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    const phoneClean = phone.trim();
    if (!phoneClean || phoneClean.length < 8) {
      setErrorMsg('Please enter a valid phone number (e.g. +91 98765 43210).');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address or leave it blank.');
      return;
    }

    if (!consentAgreed) {
      setErrorMsg('You must agree to the privacy notice before submitting your inquiry.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phoneClean,
          email: email.trim() || undefined,
          selectedPlan,
          message: message.trim() || undefined,
          consentAgreed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSuccessReceipt({
        id: data.inquiryId,
        message: data.message,
      });

      // Reset form
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setConsentAgreed(false);

      onInquirySubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred while submitting inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#20201E]/70 mb-2">
              ADMISSIONS DESK & COMMERCE · {config.brandName}
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-[#20201E] tracking-tight leading-none">
              BEGIN YOUR DISCIPLINE.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#20201E]/80 leading-relaxed font-sans">
            Schedule a walk-through of the lifting platforms, meet the head coach, or reserve your founding membership pass.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Interactive Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Gym Contact Details & Schedule */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct Channel Cards */}
            <div className="p-6 bg-[#EFEBE0] rounded-2xl border border-[#20201E]/15 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#20201E] text-[#D0F05A] rounded-lg shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#20201E]/60 mb-0.5">
                    Direct Phone Line
                  </div>
                  <a
                    href={`tel:${config.contact.phone}`}
                    className="text-base font-display font-bold text-[#20201E] hover:underline"
                  >
                    {config.contact.phoneDisplay}
                  </a>
                  <div className="text-[11px] font-sans text-[#8E8C85] mt-0.5">
                    * Placeholder phone number until launch
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#20201E] text-[#D0F05A] rounded-lg shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#20201E]/60 mb-0.5">
                    WhatsApp Admissions
                  </div>
                  <a
                    href={config.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-sans font-bold text-[#20201E] underline hover:text-black"
                  >
                    Chat on WhatsApp (Admissions Desk)
                  </a>
                  <div className="text-[11px] font-sans text-[#8E8C85] mt-0.5">
                    Instant response during operating hours
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#20201E] text-[#D0F05A] rounded-lg shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#20201E]/60 mb-0.5">
                    Facility Location
                  </div>
                  <div className="text-sm font-sans text-[#20201E] font-medium">
                    {config.contact.address}
                  </div>
                  <a
                    href={config.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#20201E] underline mt-1 inline-block"
                  >
                    Open in Maps (Placeholder coordinates)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#20201E] text-[#D0F05A] rounded-lg shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#20201E]/60 mb-0.5">
                    Operating Hours
                  </div>
                  <div className="text-xs font-sans text-[#20201E] space-y-1">
                    <div><strong>Mon – Sat:</strong> {config.contact.hours.weekdays}</div>
                    <div><strong>Sunday:</strong> {config.contact.hours.sunday}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Privacy Promise Notice */}
            <div className="p-4 bg-white rounded-xl border border-[#20201E]/10 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#20201E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#20201E]/70 font-sans leading-relaxed">
                We strictly respect your privacy. Inquiries are stored in our secure database and accessed solely by staff. We will never sell your details or send spam newsletters.
              </div>
            </div>

          </div>

          {/* Right Column: Working Interactive Membership Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#20201E]/15 p-6 sm:p-10 shadow-sm">
              
              <div className="mb-6">
                <h3 className="text-2xl font-display font-black uppercase text-[#20201E] tracking-tight">
                  MEMBERSHIP INQUIRY APPLICATION
                </h3>
                <p className="text-xs text-[#8E8C85] font-sans mt-1">
                  Fill in your details below. Our admissions desk will verify platform availability and confirm your tour slot.
                </p>
              </div>

              {/* Success Banner */}
              {successReceipt && (
                <div className="mb-6 p-5 bg-[#D0F05A]/20 border border-[#D0F05A] rounded-xl flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-[#20201E] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-display font-bold uppercase text-[#20201E]">
                      Inquiry Registered Successfully
                    </h4>
                    <p className="text-xs font-sans text-[#20201E]/80 mt-1 leading-relaxed">
                      {successReceipt.message}
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-[#20201E]/60">
                      Receipt Reference: <span className="font-bold text-[#20201E]">{successReceipt.id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-wider text-[#20201E] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 bg-[#F5F1E8]/50 text-sm text-[#20201E] focus:outline-none focus:ring-2 focus:ring-[#20201E] transition-all"
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-[#20201E] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 bg-[#F5F1E8]/50 text-sm text-[#20201E] focus:outline-none focus:ring-2 focus:ring-[#20201E] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#20201E] mb-1.5">
                      Email Address <span className="text-[#8E8C85] lowercase">(optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 bg-[#F5F1E8]/50 text-sm text-[#20201E] focus:outline-none focus:ring-2 focus:ring-[#20201E] transition-all"
                    />
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <label htmlFor="plan" className="block text-xs font-mono uppercase tracking-wider text-[#20201E] mb-1.5">
                    Preferred Membership Tier
                  </label>
                  <select
                    id="plan"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 bg-[#F5F1E8]/50 text-sm text-[#20201E] focus:outline-none focus:ring-2 focus:ring-[#20201E] transition-all"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — ₹{p.price.toLocaleString('en-IN')}/{p.period} (Placeholder)
                      </option>
                    ))}
                    <option value="General Facility Inquiry">General Facility Tour / Inquire First</option>
                  </select>
                </div>

                {/* Message / Goals */}
                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#20201E] mb-1.5">
                    Training Experience & Objectives <span className="text-[#8E8C85] lowercase">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your current training routine, injury history, or preferred workout hours..."
                    className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 bg-[#F5F1E8]/50 text-sm text-[#20201E] focus:outline-none focus:ring-2 focus:ring-[#20201E] transition-all"
                  />
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#20201E]/30 text-[#20201E] focus:ring-[#20201E]"
                    />
                    <span className="text-xs text-[#20201E]/80 font-sans leading-relaxed">
                      I consent to {config.brandName} contacting me via phone call or WhatsApp regarding membership admissions and scheduling a facility tour. I understand my data will not be shared with third parties.
                    </span>
                  </label>
                </div>

                {/* Submit CTA */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#20201E] text-[#D0F05A] font-display font-bold text-base uppercase tracking-wider rounded-lg hover:bg-black active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Membership Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
