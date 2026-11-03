import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Plan } from '../../server.ts';
import { GymConfig } from '../config/gymConfig.ts';

interface PaymentModalProps {
  config: GymConfig;
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  config,
  plan,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [email, setEmail] = useState('member.demo@brandgym.placeholder');
  const [step, setStep] = useState<'create' | 'verifying' | 'success' | 'error'>('create');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handleSimulatePayment = async () => {
    setStep('verifying');
    setErrorMessage(null);

    try {
      // Step 1: Create Order on Backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, userEmail: email }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      setOrderDetails(orderData.order);

      // Simulate client interaction with payment gateway (e.g. Razorpay modal popup)
      await new Promise((r) => setTimeout(r, 1200));

      // Step 2: Server-Side Signature Verification & Order Fulfillment
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          paymentId: `pay_sim_${Date.now()}_verified`,
          planId: plan.id,
          userEmail: email,
          signatureSimulation: 'sha256_verified_token_hash',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      setReceiptDetails(verifyData.receipt);
      setStep('success');
      onPaymentSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed.');
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F1E8] w-full max-w-lg rounded-2xl border border-[#20201E]/20 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#20201E] text-[#F5F1E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D0F05A] text-[#20201E] rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">
                MEMBERSHIP CHECKOUT ARCHITECTURE
              </h3>
              <p className="text-xs font-mono text-[#BDBBB4]">
                RAZORPAY / STRIPE SERVER-SIDE INTEGRATION
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

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {step === 'create' && (
            <div className="space-y-5">
              
              {/* Plan Summary Card */}
              <div className="p-4 bg-white rounded-xl border border-[#20201E]/15">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-[#8E8C85] uppercase">Selected Tier</span>
                  <span className="text-[10px] font-mono bg-[#EFEBE0] px-2 py-0.5 rounded text-[#20201E]">
                    INDICATIVE RATE
                  </span>
                </div>
                <h4 className="text-2xl font-display font-black uppercase text-[#20201E]">
                  {plan.name}
                </h4>
                <div className="text-3xl font-display font-black text-[#20201E] tabular-nums mt-1">
                  ₹{plan.price.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-sans font-normal text-[#8E8C85]">
                    /{plan.period} (includes taxes)
                  </span>
                </div>
              </div>

              {/* Educational Developer Notice for Students */}
              <div className="p-3.5 bg-[#EFEBE0] rounded-xl border border-[#20201E]/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#20201E] shrink-0 mt-0.5" />
                <div className="text-xs text-[#20201E]/80 font-sans leading-relaxed">
                  <strong className="text-[#20201E]">Production Payment Flow:</strong> To connect your real business bank account, you will generate Razorpay Key ID & Key Secret in the Razorpay dashboard, place them into server environment variables, and use this exact backend order creation and signature verification pipeline.
                </div>
              </div>

              {/* Member Billing Email */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#20201E] mb-1.5">
                  Billing Email for Receipt
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#20201E]/20 text-sm bg-white"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-[#20201E] text-[#D0F05A] font-display font-bold text-base uppercase tracking-wider rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <span>Execute Sandbox Verification (Test ₹{plan.price.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {step === 'verifying' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#20201E] mx-auto" />
              <div className="font-display font-bold text-lg uppercase text-[#20201E]">
                CREATING ORDER & VERIFYING SERVER SIGNATURE
              </div>
              <p className="text-xs font-mono text-[#8E8C85] max-w-sm mx-auto">
                Communicating with Express backend order endpoint and executing cryptographic verification...
              </p>
            </div>
          )}

          {step === 'success' && receiptDetails && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-xl font-display font-black uppercase text-emerald-900">
                  PAYMENT VERIFIED BY SERVER
                </h4>
                <p className="text-xs text-emerald-800 font-sans mt-1">
                  Membership record created and active status enabled.
                </p>
              </div>

              {/* Verified Receipt Specs */}
              <div className="p-4 bg-white rounded-xl border border-[#20201E]/15 font-mono text-xs space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#8E8C85]">Order Reference:</span>
                  <span className="font-bold text-[#20201E]">{receiptDetails.orderId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#8E8C85]">Payment ID:</span>
                  <span className="text-[#20201E]">{receiptDetails.paymentId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#8E8C85]">Plan Activated:</span>
                  <span className="text-[#20201E] font-sans font-medium">{receiptDetails.planName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#8E8C85]">Amount Settled:</span>
                  <span className="text-[#20201E] font-bold">₹{receiptDetails.amount.toLocaleString('en-IN')} INR</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#8E8C85]">Timestamp:</span>
                  <span className="text-[#20201E]">{new Date(receiptDetails.verifiedAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#20201E] text-[#D0F05A] font-display font-bold uppercase rounded-lg hover:bg-black transition-colors"
              >
                Done / Close Receipt
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4 text-center">
              <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
              <div className="font-display font-bold text-lg uppercase text-[#20201E]">
                Transaction Verification Failed
              </div>
              <p className="text-xs text-red-700">{errorMessage}</p>
              <button
                onClick={() => setStep('create')}
                className="px-4 py-2 bg-[#20201E] text-white text-xs font-mono rounded"
              >
                Try Again
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
