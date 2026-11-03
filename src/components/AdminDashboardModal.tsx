import React, { useState, useEffect } from 'react';
import { X, Shield, Users, CheckCircle, Clock, Search, MessageSquare, AlertTriangle, FileText, Check, Trash2 } from 'lucide-react';
import { Inquiry, Transformation, PaymentRecord } from '../../server.ts';
import { GymConfig } from '../config/gymConfig.ts';

interface AdminDashboardModalProps {
  config: GymConfig;
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  config,
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'moderation' | 'payments'>('inquiries');

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Moderation state
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  // Payments state
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      const headers = { Authorization: 'Bearer demo-admin-session-active' };

      const [inqRes, transRes, payRes] = await Promise.all([
        fetch('/api/admin/inquiries', { headers }),
        fetch('/api/admin/transformations', { headers }),
        fetch('/api/admin/payments', { headers }),
      ]);

      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
      }
      if (transRes.ok) {
        const transData = await transRes.json();
        setTransformations(transData.transformations || []);
      }
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (adminPassword === 'admin123' || adminPassword === 'gym-admin-secret-2026') {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid admin password. (Hint for students: use "admin123")');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer demo-admin-session-active',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleModerateTransformation = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/transformations/${id}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer demo-admin-session-active',
        },
        body: JSON.stringify({ status, moderationNotes: `Reviewed by Gym Staff on ${new Date().toLocaleDateString()}` }),
      });
      if (res.ok) {
        await fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error('Moderation failed:', err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F1E8] w-full max-w-5xl rounded-2xl border border-[#20201E]/30 overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#20201E] text-[#F5F1E8] flex items-center justify-between border-b border-[#30302D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D0F05A] text-[#20201E] rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-black uppercase tracking-tight">
                  ADMINISTRATION & MODERATION DESK
                </h3>
                <span className="text-[10px] font-mono bg-[#D0F05A]/20 text-[#D0F05A] px-2 py-0.5 rounded border border-[#D0F05A]/40">
                  STAFF AUTHENTICATED
                </span>
              </div>
              <p className="text-xs font-mono text-[#BDBBB4]">
                {config.brandName} · REAL-TIME ADMISSIONS WORKSPACE
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

        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto my-auto text-center">
            <div className="w-12 h-12 rounded-full bg-[#20201E] text-[#D0F05A] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-display font-black uppercase text-[#20201E] mb-2">
              STAFF AUTHORIZATION REQUIRED
            </h4>
            <p className="text-xs text-[#8E8C85] font-sans mb-6">
              Enter the staff credentials to view admissions, inquiry contacts, transformation moderation queues, and payment logs.
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 text-xs rounded border border-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Staff Password"
                className="w-full px-4 py-3 rounded-lg border border-[#20201E]/20 text-sm bg-white"
              />
              <div className="text-[11px] font-mono text-[#8E8C85] text-left">
                Default project password: <code className="bg-[#EFEBE0] px-1 py-0.5 rounded text-[#20201E]">admin123</code>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#20201E] text-[#D0F05A] font-display font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
              >
                Authenticate Staff Desk
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top Navigation Bar with Tabs */}
            <div className="p-4 bg-[#EFEBE0] border-b border-[#20201E]/15 flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                    activeTab === 'inquiries'
                      ? 'bg-[#20201E] text-[#D0F05A]'
                      : 'text-[#20201E]/80 hover:text-[#20201E]'
                  }`}
                >
                  Membership Inquiries ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                    activeTab === 'moderation'
                      ? 'bg-[#20201E] text-[#D0F05A]'
                      : 'text-[#20201E]/80 hover:text-[#20201E]'
                  }`}
                >
                  Photo Moderation ({transformations.filter(t => t.status === 'PENDING').length} Pending)
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-[#20201E] text-[#D0F05A]'
                      : 'text-[#20201E]/80 hover:text-[#20201E]'
                  }`}
                >
                  Verified Payment Logs ({payments.length})
                </button>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs font-mono text-[#8E8C85] hover:text-[#20201E] underline"
              >
                Lock Session
              </button>
            </div>

            {/* Tab 1: Inquiries Management */}
            {activeTab === 'inquiries' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-[#8E8C85] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search inquiries by name, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
                    <span className="text-[#8E8C85]">Status:</span>
                    {['ALL', 'NEW', 'CONTACTED', 'SCHEDULED_TOUR', 'ENROLLED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-[11px] ${
                          statusFilter === st
                            ? 'bg-[#20201E] text-[#D0F05A] font-bold'
                            : 'bg-white text-[#20201E] border border-[#20201E]/15'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inquiries Table */}
                <div className="border border-[#20201E]/15 rounded-xl overflow-hidden bg-white shadow-sm">
                  {filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-xs font-mono text-[#8E8C85]">
                      No inquiry applications matching the current criteria.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#20201E]/10">
                      {filteredInquiries.map((inq) => (
                        <div key={inq.id} className="p-4 hover:bg-[#F5F1E8]/40 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold uppercase text-base text-[#20201E]">
                                  {inq.fullName}
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                  inq.status === 'NEW'
                                    ? 'bg-[#D0F05A] text-[#20201E]'
                                    : inq.status === 'CONTACTED'
                                    ? 'bg-blue-100 text-blue-900'
                                    : inq.status === 'ENROLLED'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-stone-200 text-stone-800'
                                }`}>
                                  {inq.status}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-[#20201E]/70 mt-0.5 flex flex-wrap gap-x-3">
                                <span>Phone: <strong className="text-[#20201E]">{inq.phone}</strong></span>
                                {inq.email && <span>Email: {inq.email}</span>}
                                <span>Plan: <strong className="text-[#20201E]">{inq.selectedPlan}</strong></span>
                              </div>
                            </div>

                            {/* Status Change Buttons */}
                            <div className="flex items-center gap-1.5 self-start md:self-auto">
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                                disabled={updatingId === inq.id}
                                className="text-xs font-mono px-2.5 py-1.5 rounded border border-[#20201E]/20 bg-white"
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="SCHEDULED_TOUR">SCHEDULED_TOUR</option>
                                <option value="ENROLLED">ENROLLED</option>
                                <option value="ARCHIVED">ARCHIVED</option>
                              </select>

                              <a
                                href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.fullName)}%2C%20this%20is%20${encodeURIComponent(config.brandName)}%20admissions%20desk.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 bg-[#20201E] text-[#D0F05A] text-xs font-mono rounded hover:bg-black"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </div>

                          {inq.message && (
                            <div className="mt-2 text-xs font-sans text-[#20201E]/80 bg-[#F5F1E8] p-2.5 rounded border border-[#20201E]/10">
                              <strong>Member Message:</strong> "{inq.message}"
                            </div>
                          )}

                          <div className="mt-2 text-[10px] font-mono text-[#8E8C85] flex items-center justify-between">
                            <span>Inquiry ID: {inq.id}</span>
                            <span>Submitted: {new Date(inq.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 2: Transformation Moderation Queue */}
            {activeTab === 'moderation' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="text-xs font-mono text-[#8E8C85] mb-2">
                  All member progression logs require explicit signed consent and staff review prior to public exhibition.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transformations.map((t) => (
                    <div key={t.id} className="p-5 bg-white rounded-xl border border-[#20201E]/15 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-display font-bold uppercase text-lg text-[#20201E]">
                            {t.memberName} ({t.anonymousLabel})
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            t.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : t.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-[#20201E]/70 mb-2">
                          Duration: {t.durationMonths} Months · Focus: {t.focusArea}
                        </div>

                        <div className="text-xs font-sans text-[#20201E]/80 bg-[#F5F1E8] p-3 rounded mb-3">
                          "{t.story}"
                        </div>

                        <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1.5 mb-4">
                          <Check className="w-3.5 h-3.5" />
                          <span>Consent Signed & Verified: {t.consentDate}</span>
                        </div>
                      </div>

                      {/* Moderation Controls */}
                      <div className="flex items-center gap-2 pt-3 border-t border-[#20201E]/10">
                        {t.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleModerateTransformation(t.id, 'APPROVED')}
                            className="flex-1 py-2 bg-emerald-700 text-white rounded text-xs font-mono font-bold hover:bg-emerald-800"
                          >
                            Approve for Public Gallery
                          </button>
                        )}
                        {t.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleModerateTransformation(t.id, 'REJECTED')}
                            className="py-2 px-3 border border-red-300 text-red-700 rounded text-xs font-mono hover:bg-red-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Payment Logs */}
            {activeTab === 'payments' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-[#EFEBE0] rounded-xl border border-[#20201E]/15 text-xs font-sans text-[#20201E]/80">
                  <strong className="text-[#20201E]">Payment Architecture Sandbox:</strong> Displays server-side verified transactions. When integrating production Razorpay or Stripe accounts, secret keys are kept server-side in `.env` and verify SHA256 HMAC webhook signatures.
                </div>

                <div className="border border-[#20201E]/15 rounded-xl overflow-hidden bg-white">
                  <div className="p-3 bg-[#20201E] text-[#F5F1E8] font-mono text-xs grid grid-cols-5 font-bold">
                    <span>Order ID</span>
                    <span>Plan</span>
                    <span>Amount</span>
                    <span>Provider</span>
                    <span className="text-right">Server Verification</span>
                  </div>
                  <div className="divide-y divide-[#20201E]/10">
                    {payments.map((p) => (
                      <div key={p.id} className="p-3 grid grid-cols-5 font-mono text-xs items-center">
                        <span className="text-[#20201E] font-medium">{p.orderId}</span>
                        <span className="font-sans">{p.planName}</span>
                        <span className="tabular-nums">₹{p.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[#8E8C85]">{p.provider}</span>
                        <span className="text-right text-emerald-700 font-bold">VERIFIED_ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
