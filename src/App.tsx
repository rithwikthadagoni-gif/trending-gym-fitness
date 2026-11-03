import React, { useState, useEffect } from 'react';
import { defaultGymConfig, GymConfig } from './config/gymConfig.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { EquipmentSection } from './components/EquipmentSection.tsx';
import { MembershipPlans } from './components/MembershipPlans.tsx';
import { TransformationsSection } from './components/TransformationsSection.tsx';
import { ContactInquirySection } from './components/ContactInquirySection.tsx';
import { Footer } from './components/Footer.tsx';
import { MemberPortalModal } from './components/MemberPortalModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { BrandCustomizerModal } from './components/BrandCustomizerModal.tsx';
import { Plan, Transformation } from '../server.ts';

export default function App() {
  const [config, setConfig] = useState<GymConfig>(defaultGymConfig);

  // Data from backend
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  // Modals state
  const [memberPortalOpen, setMemberPortalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<Plan | null>(null);

  // Inquiry prefill
  const [selectedPlanForInquiry, setSelectedPlanForInquiry] = useState<string>('Quarterly All-Access');

  // Load backend data
  const loadInitialData = async () => {
    try {
      const [plansRes, transRes] = await Promise.all([
        fetch('/api/plans'),
        fetch('/api/transformations'),
      ]);

      if (plansRes.ok) {
        const pData = await plansRes.json();
        setPlans(pData.plans || []);
      }
      if (transRes.ok) {
        const tData = await transRes.json();
        setTransformations(tData.transformations || []);
      }
    } catch (err) {
      console.warn('Could not fetch initial server data, falling back to local defaults:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOpenInquiry = (planName?: string) => {
    if (planName) {
      setSelectedPlanForInquiry(planName);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInitiatePayment = (plan: Plan) => {
    setSelectedPaymentPlan(plan);
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#20201E] flex flex-col font-sans selection:bg-[#D0F05A] selection:text-[#20201E]">
      
      {/* 3-Zone Sticky Navigation */}
      <Navbar
        brandName={config.brandName}
        onOpenInquiry={handleOpenInquiry}
        onOpenMemberPortal={() => setMemberPortalOpen(true)}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Hero Section with Interactive 3D Barbell Plate and Editorial Photography */}
        <HeroSection
          config={config}
          onOpenInquiry={() => handleOpenInquiry()}
        />

        {/* Founding Philosophy & About Sanctuary */}
        <AboutSection config={config} />

        {/* Equipment & Training Curriculum */}
        <EquipmentSection config={config} />

        {/* Transparent Membership Plans with Indicative Pricing */}
        <MembershipPlans
          plans={plans}
          onSelectPlanForInquiry={handleOpenInquiry}
          onInitiatePaymentSandbox={handleInitiatePayment}
        />

        {/* Member Progression Stories (Consent-Verified Only) */}
        <TransformationsSection
          transformations={transformations}
          onOpenSubmissionModal={() => setMemberPortalOpen(true)}
        />

        {/* Direct Contact & Working Membership Inquiry Submission Form */}
        <ContactInquirySection
          config={config}
          plans={plans}
          selectedPlanPreload={selectedPlanForInquiry}
          onInquirySubmitted={loadInitialData}
        />

      </main>

      {/* Quiet Disciplined Footer */}
      <Footer
        config={config}
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
      />

      {/* Modals & Portals */}
      <MemberPortalModal
        config={config}
        isOpen={memberPortalOpen}
        onClose={() => setMemberPortalOpen(false)}
        onTransformationSubmitted={loadInitialData}
      />

      <AdminDashboardModal
        config={config}
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        onDataChanged={loadInitialData}
      />

      <PaymentModal
        config={config}
        plan={selectedPaymentPlan}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={loadInitialData}
      />

      <BrandCustomizerModal
        config={config}
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        onUpdateConfig={(newConfig) => setConfig(newConfig)}
      />

    </div>
  );
}
