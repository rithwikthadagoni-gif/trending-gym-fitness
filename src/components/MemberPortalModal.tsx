import React, { useState } from 'react';
import { X, User, ShieldCheck, CheckCircle2, Upload, AlertCircle, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { GymConfig } from '../config/gymConfig.ts';

interface MemberPortalModalProps {
  config: GymConfig;
  isOpen: boolean;
  onClose: () => void;
  onTransformationSubmitted: () => void;
}

export const MemberPortalModal: React.FC<MemberPortalModalProps> = ({
  config,
  isOpen,
  onClose,
  onTransformationSubmitted,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('devansh.k@example.com');
  const [password, setPassword] = useState('password123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Transformation submission state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [memberName, setMemberName] = useState('Devansh K.');
  const [durationMonths, setDurationMonths] = useState('6');
  const [focusArea, setFocusArea] = useState('Olympic Lifting & Calibrated Strength');
  const [story, setStory] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [submittingTrans, setSubmittingTrans] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    // Simulate active member session
    setIsLoggedIn(true);
  };

  const handleSubmitTransformation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      alert('Explicit member consent is legally required before submitting transformation photographs.');
      return;
    }
    setSubmittingTrans(true);
    try {
      const res = await fetch('/api/transformations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName,
          durationMonths: Number(durationMonths),
          focusArea,
          story,
          consentAgreed: true,
          beforePhotoUrl: '/src/assets/images/gym_athlete_editorial_1793721300934.jpg',
          afterPhotoUrl: '/src/assets/images/gym_hero_editorial_1793721298497.jpg',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSubmitSuccessMsg('Submitted successfully! Your progression log is currently in the admin moderation queue.');
      onTransformationSubmitted();
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Error submitting transformation.');
    } finally {
      setSubmittingTrans(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F1E8] w-full max-w-2xl rounded-2xl border border-[#20201E]/20 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#20201E] text-[#F5F1E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D0F05A] text-[#20201E] rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">
                MEMBER SANCTUARY PORTAL
              </h3>
              <p className="text-xs font-mono text-[#BDBBB4]">
                {config.brandName} · ATHLETE ACCESS
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {!isLoggedIn ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-4">
              <div className="mb-6 text-center">
                <h4 className="text-2xl font-display font-black uppercase text-[#20201E]">
                  SIGN IN TO YOUR MEMBERSHIP
                </h4>
                <p className="text-xs text-[#8E8C85] font-sans mt-1">
                  Access your active pass, platform bookings, and verified attendance records.
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-xs text-red-800 rounded">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                    Member Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#20201E] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white"
                  />
                  <div className="mt-1 text-[11px] font-mono text-[#8E8C85]">
                    Demo account pre-filled for evaluation
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#20201E] text-[#D0F05A] font-display font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
                >
                  Enter Member Portal
                </button>
              </form>
            </div>
          ) : (
            /* Active Member Dashboard */
            <div className="space-y-6">
              
              {/* Member Profile Badge */}
              <div className="p-5 bg-white rounded-xl border border-[#20201E]/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#8E8C85] uppercase">Active Athlete</div>
                  <h4 className="text-2xl font-display font-black uppercase text-[#20201E]">Devansh K.</h4>
                  <div className="text-xs font-mono text-[#20201E]/70">Member ID: #ATH-8841-HYD</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#D0F05A] text-[#20201E] text-xs font-mono font-bold rounded">
                    ACTIVE · ALL-ACCESS
                  </span>
                  <div className="text-[11px] font-mono text-[#8E8C85] mt-1">
                    Valid through: 15 Feb 2027
                  </div>
                </div>
              </div>

              {/* Membership Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#EFEBE0] rounded-lg border border-[#20201E]/10">
                  <div className="text-[11px] font-mono text-[#8E8C85] uppercase">Plan Tier</div>
                  <div className="text-base font-display font-bold uppercase text-[#20201E] mt-0.5">
                    Quarterly All-Access
                  </div>
                  <div className="text-[10px] text-[#20201E]/60 mt-1">₹8,999 (Verified)</div>
                </div>

                <div className="p-4 bg-[#EFEBE0] rounded-lg border border-[#20201E]/10">
                  <div className="text-[11px] font-mono text-[#8E8C85] uppercase">Check-Ins This Month</div>
                  <div className="text-xl font-display font-black text-[#20201E] mt-0.5 tabular-nums">
                    18 / 22 Days
                  </div>
                  <div className="text-[10px] text-[#20201E]/60 mt-1">Consistent Barbell Routine</div>
                </div>

                <div className="p-4 bg-[#EFEBE0] rounded-lg border border-[#20201E]/10">
                  <div className="text-[11px] font-mono text-[#8E8C85] uppercase">Recovery Credits</div>
                  <div className="text-xl font-display font-black text-[#20201E] mt-0.5 tabular-nums">
                    6 Sessions
                  </div>
                  <div className="text-[10px] text-[#20201E]/60 mt-1">Sauna & Cold Plunge</div>
                </div>
              </div>

              {/* Photo Transformation Submission Trigger */}
              <div className="p-5 bg-[#20201E] text-[#F5F1E8] rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-base font-display font-bold uppercase tracking-tight">
                    Share Your Athlete Progression
                  </h5>
                  <p className="text-xs text-[#BDBBB4] font-sans mt-0.5 max-w-sm">
                    Submit your strength journey for coach review and consent-based publication.
                  </p>
                </div>
                <button
                  onClick={() => setShowSubmitModal(!showSubmitModal)}
                  className="px-4 py-2 bg-[#D0F05A] text-[#20201E] text-xs font-display font-bold uppercase rounded hover:bg-[#c2e448] transition-colors shrink-0"
                >
                  {showSubmitModal ? 'Close Form' : 'Submit Log'}
                </button>
              </div>

              {/* Submission Form Drawer */}
              {showSubmitModal && (
                <div className="p-5 bg-white rounded-xl border border-[#20201E]/15 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#20201E] font-bold uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#20201E]" />
                    <span>Member Consent & Progression Submission</span>
                  </div>

                  {submitSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                      {submitSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmitTransformation} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#20201E]">Athlete Name</label>
                        <input
                          type="text"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded bg-[#F5F1E8]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#20201E]">Duration (Months)</label>
                        <input
                          type="number"
                          value={durationMonths}
                          onChange={(e) => setDurationMonths(e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded bg-[#F5F1E8]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#20201E]">Focus Area</label>
                      <input
                        type="text"
                        value={focusArea}
                        onChange={(e) => setFocusArea(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded bg-[#F5F1E8]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#20201E]">Your Training Story</label>
                      <textarea
                        rows={2}
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="Key milestones, strength PRs, recovery habits..."
                        className="w-full px-3 py-2 text-xs border rounded bg-[#F5F1E8]/50"
                      />
                    </div>

                    <div className="p-3 bg-[#EFEBE0] rounded text-xs text-[#20201E]">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentAgreed}
                          onChange={(e) => setConsentAgreed(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          <strong>Consent Agreement:</strong> I explicitly consent to {config.brandName} publishing my progression log and photographs on their official website. I retain the right to withdraw consent at any time.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingTrans}
                      className="w-full py-2.5 bg-[#20201E] text-[#D0F05A] text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {submittingTrans ? 'Submitting to Moderation Desk...' : 'Submit to Admin Desk'}
                    </button>
                  </form>
                </div>
              )}

              {/* Verified Payment Records Table */}
              <div>
                <h5 className="text-sm font-display font-bold uppercase text-[#20201E] mb-2">
                  Verified Payment Receipts
                </h5>
                <div className="border border-[#20201E]/15 rounded-lg overflow-hidden bg-white text-xs">
                  <div className="p-3 bg-[#EFEBE0] font-mono text-[11px] text-[#20201E] grid grid-cols-4 font-bold">
                    <span>Receipt ID</span>
                    <span>Plan</span>
                    <span>Amount</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="p-3 grid grid-cols-4 font-mono text-[11px] border-t border-[#20201E]/10 items-center">
                    <span className="text-[#8E8C85]">#PAY-9841-VERIFIED</span>
                    <span className="font-sans font-medium">Quarterly All-Access</span>
                    <span className="tabular-nums">₹8,999</span>
                    <span className="text-right text-emerald-700 font-bold">PAID (SANDBOX)</span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-xs font-mono text-[#8E8C85] hover:text-[#20201E] underline"
                >
                  Sign Out of Member Sanctuary
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
