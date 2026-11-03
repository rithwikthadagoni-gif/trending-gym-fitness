import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

// ---------------------------------------------------------------------------
// In-Memory Database Store with Pre-seeded Realistic Athletic Data
// ---------------------------------------------------------------------------

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  selectedPlan: string;
  message?: string;
  consentAgreed: boolean;
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED_TOUR' | 'ENROLLED' | 'ARCHIVED';
  notes?: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  period: 'month' | 'quarter' | 'year' | 'session';
  isPlaceholderPrice: boolean;
  description: string;
  features: string[];
  exclusions: string[];
  popular?: boolean;
}

export interface Transformation {
  id: string;
  memberName: string;
  anonymousLabel: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  durationMonths: number;
  focusArea: string;
  story: string;
  consentSigned: boolean;
  consentDate: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  moderationNotes?: string;
  submittedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentId?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  userEmail: string;
  provider: 'RAZORPAY_SANDBOX' | 'STRIPE_TEST';
  verifiedAt?: string;
  createdAt: string;
}

// Initial In-Memory State
let inquiries: Inquiry[] = [
  {
    id: 'inq_01',
    fullName: 'Arjun Verma',
    phone: '+91 98700 12345',
    email: 'arjun.v@example.com',
    selectedPlan: 'Quarterly All-Access',
    message: 'Interested in early morning 6:00 AM lifting platforms and coach guidance.',
    consentAgreed: true,
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'inq_02',
    fullName: 'Pooja Reddy',
    phone: '+91 98230 54321',
    email: 'pooja.r@example.com',
    selectedPlan: 'Annual Champion',
    message: 'Looking for Olympic barbell coaching and contrast recovery access.',
    consentAgreed: true,
    status: 'SCHEDULED_TOUR',
    notes: 'Tour scheduled for Saturday 10:00 AM.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  }
];

let plans: Plan[] = [
  {
    id: 'plan_day',
    name: 'Day Session Pass',
    slug: 'day-pass',
    price: 499,
    period: 'session',
    isPlaceholderPrice: true,
    description: 'Single-entry access to the strength arena, lifting platforms, and recovery amenities.',
    features: [
      'Full facility & platform access for 1 day',
      'Competition barbell & calibrated plate usage',
      'Cold plunge & infrared sauna post-workout',
      'Locker room & high-pressure shower amenities'
    ],
    exclusions: [
      'Personal programming consultation',
      'Permanent gym locker assignment'
    ]
  },
  {
    id: 'plan_monthly',
    name: 'Monthly Standard',
    slug: 'monthly',
    price: 3499,
    period: 'month',
    isPlaceholderPrice: true,
    description: 'Flexible monthly training pass with unlimited peak access and biometric baseline.',
    features: [
      'Unlimited arena access (05:30 – 22:30)',
      'Quarterly movement screening & baseline check',
      'Full recovery bay privileges (sauna & cold plunge)',
      'Member portal & workout logging access'
    ],
    exclusions: [
      '1-on-1 private coach specialization (add-on)',
      'Free guest day passes'
    ]
  },
  {
    id: 'plan_quarterly',
    name: 'Quarterly All-Access',
    slug: 'quarterly',
    price: 8999,
    period: 'quarter',
    popular: true,
    isPlaceholderPrice: true,
    description: 'Our most focused commitment for dedicated strength and conditioning progression.',
    features: [
      'Everything in Monthly Standard',
      'Personalized lifting technique calibration',
      'Priority platform reservation during peak hours',
      '2 complimentary guest training passes/month',
      '15% discount on club nutrition & merchandise'
    ],
    exclusions: [
      'Daily dedicated 1-on-1 private coaching'
    ]
  },
  {
    id: 'plan_annual',
    name: 'Annual Champion',
    slug: 'annual',
    price: 29999,
    period: 'year',
    isPlaceholderPrice: true,
    description: 'The ultimate athletic membership for long-term physical mastery and elite standards.',
    features: [
      'Unlimited 365-day all-access privileges',
      'Personalized strength cycle programming review',
      'Dedicated permanent custom locker & gear towel service',
      'Monthly recovery session with in-house physiotherapist',
      'Unlimited guest passes for lifting partners',
      'Guaranteed membership fee freeze for renewals'
    ],
    exclusions: []
  }
];

let transformations: Transformation[] = [
  {
    id: 'trans_01',
    memberName: 'Devansh K.',
    anonymousLabel: 'Athlete D.K.',
    beforePhotoUrl: '/src/assets/images/gym_athlete_editorial_1793721300934.jpg',
    afterPhotoUrl: '/src/assets/images/gym_hero_editorial_1793721298497.jpg',
    durationMonths: 6,
    focusArea: 'Olympic Weightlifting & Hypertrophy',
    story: 'Rebuilt posture, added 35kg to raw squat while shedding 8% body fat through disciplined barbell fundamentals.',
    consentSigned: true,
    consentDate: '2026-08-14',
    status: 'APPROVED',
    submittedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'trans_02',
    memberName: 'Sneha M.',
    anonymousLabel: 'Athlete S.M.',
    beforePhotoUrl: '/src/assets/images/gym_equipment_macro_1793721299225.jpg',
    afterPhotoUrl: '/src/assets/images/gym_facility_arena_1793721298640.jpg',
    durationMonths: 4,
    focusArea: 'Athletic Conditioning & Mobility',
    story: 'Recovered from desk-bound back stiffness to completing first 100kg deadlift and sprint interval benchmark.',
    consentSigned: true,
    consentDate: '2026-09-02',
    status: 'APPROVED',
    submittedAt: '2026-09-03T14:30:00Z',
  }
];

let paymentRecords: PaymentRecord[] = [
  {
    id: 'pay_01',
    orderId: 'order_test_9841',
    paymentId: 'pay_sim_9841_verified',
    planId: 'plan_quarterly',
    planName: 'Quarterly All-Access',
    amount: 8999,
    currency: 'INR',
    status: 'SUCCESS',
    userEmail: 'member.demo@brandgym.placeholder',
    provider: 'RAZORPAY_SANDBOX',
    verifiedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

// ---------------------------------------------------------------------------
// Security & Admin Authentication Helper
// ---------------------------------------------------------------------------
const ADMIN_API_KEY = process.env.ADMIN_SECRET_KEY || 'gym-admin-secret-2026';

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authorization token required.' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_API_KEY && token !== 'demo-admin-session-active') {
    return res.status(403).json({ error: 'Forbidden: Invalid administrative credentials.' });
  }
  next();
}

// ---------------------------------------------------------------------------
// Public API Endpoints
// ---------------------------------------------------------------------------

// 1. Submit Membership Inquiry (with strict validation & duplicate prevention)
app.post('/api/inquiries', (req: Request, res: Response) => {
  const { fullName, phone, email, selectedPlan, message, consentAgreed } = req.body;

  // Strict Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
  }

  const phoneRegex = /^[+]?[\d\s\-().]{8,15}$/;
  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ error: 'Please enter a valid contact phone number with country/area code.' });
  }

  if (email && typeof email === 'string' && email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address or leave blank.' });
    }
  }

  if (!consentAgreed) {
    return res.status(400).json({ error: 'You must agree to the privacy notice to submit your inquiry.' });
  }

  // Duplicate check: Same phone submitted in last 3 minutes
  const recentDuplicate = inquiries.find(
    (inq) => inq.phone.replace(/\D/g, '') === phone.replace(/\D/g, '') &&
    Date.now() - new Date(inq.createdAt).getTime() < 3 * 60 * 1000
  );

  if (recentDuplicate) {
    return res.status(429).json({
      error: 'We have already received an inquiry from this number a moment ago. Our admissions team will reach out promptly!'
    });
  }

  const newInquiry: Inquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    selectedPlan: selectedPlan || 'General Inquiries',
    message: message ? message.trim() : undefined,
    consentAgreed: true,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);

  return res.status(201).json({
    success: true,
    message: 'Inquiry received successfully. Our admissions desk will call or WhatsApp you within 24 operational hours.',
    inquiryId: newInquiry.id,
  });
});

// 2. Get Membership Plans
app.get('/api/plans', (_req: Request, res: Response) => {
  res.json({
    plans,
    note: 'All prices shown are indicative placeholders until formal commercial launch.'
  });
});

// 3. Get Public Transformation Stories (Approved Only with Verified Consent)
app.get('/api/transformations', (_req: Request, res: Response) => {
  const approved = transformations
    .filter((t) => t.status === 'APPROVED' && t.consentSigned)
    .map((t) => ({
      id: t.id,
      memberName: t.anonymousLabel || t.memberName,
      beforePhotoUrl: t.beforePhotoUrl,
      afterPhotoUrl: t.afterPhotoUrl,
      durationMonths: t.durationMonths,
      focusArea: t.focusArea,
      story: t.story,
      consentVerified: true
    }));

  res.json({ transformations: approved });
});

// 4. Member Photo Submission Workflow (Consent-Enforced, Goes to Moderation Queue)
app.post('/api/transformations/submit', (req: Request, res: Response) => {
  const { memberName, beforePhotoUrl, afterPhotoUrl, durationMonths, focusArea, story, consentAgreed } = req.body;

  if (!consentAgreed) {
    return res.status(400).json({ error: 'Explicit member consent is legally required before submitting transformation photographs.' });
  }

  if (!memberName || !story || !focusArea) {
    return res.status(400).json({ error: 'Please provide athlete name, training story, and program focus area.' });
  }

  const newSubmission: Transformation = {
    id: `trans_${Date.now()}`,
    memberName: memberName.trim(),
    anonymousLabel: `Athlete ${memberName.trim().charAt(0)}.${memberName.trim().slice(-1).toUpperCase()}`,
    beforePhotoUrl: beforePhotoUrl || '/src/assets/images/gym_athlete_editorial_1793721300934.jpg',
    afterPhotoUrl: afterPhotoUrl || '/src/assets/images/gym_hero_editorial_1793721298497.jpg',
    durationMonths: Number(durationMonths) || 3,
    focusArea: focusArea.trim(),
    story: story.trim(),
    consentSigned: true,
    consentDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    submittedAt: new Date().toISOString()
  };

  transformations.unshift(newSubmission);

  res.status(201).json({
    success: true,
    message: 'Your transformation has been securely submitted to the admissions and coaching desk for moderation before public display.',
    submissionId: newSubmission.id
  });
});

// 5. Online Payments Architecture: Create Order
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { planId, userEmail } = req.body;
  const plan = plans.find(p => p.id === planId);

  if (!plan) {
    return res.status(404).json({ error: 'Selected membership plan could not be located.' });
  }

  const orderId = `order_gym_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const order = {
    orderId,
    amount: plan.price * 100, // Amount in paise for INR / subunits
    displayAmount: plan.price,
    currency: 'INR',
    planId: plan.id,
    planName: plan.name,
    keyPlaceholder: 'rzp_test_placeholder_key_not_set',
    isSandboxSimulation: true,
    instructions: 'In production, this communicates with Razorpay / Stripe Order APIs using server-side secret keys.'
  };

  res.json({ success: true, order });
});

// 6. Online Payments Architecture: Server-side Payment Verification
app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { orderId, paymentId, planId, userEmail, signatureSimulation } = req.body;

  if (!orderId || !paymentId) {
    return res.status(400).json({ error: 'Missing order ID or payment ID verification parameters.' });
  }

  const plan = plans.find(p => p.id === planId) || plans[1];

  // In production, HMAC SHA256 signature verification occurs here:
  // crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(orderId + "|" + paymentId).digest('hex') === signature
  const verifiedRecord: PaymentRecord = {
    id: `pay_${Date.now()}`,
    orderId,
    paymentId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    currency: 'INR',
    status: 'SUCCESS',
    userEmail: userEmail || 'member.demo@brandgym.placeholder',
    provider: 'RAZORPAY_SANDBOX',
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  paymentRecords.unshift(verifiedRecord);

  res.json({
    success: true,
    message: 'Payment verified and confirmed by server. Membership status active.',
    receipt: verifiedRecord
  });
});

// 7. Member Authentication Simulator / Demo
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (role === 'admin') {
    if (password === 'admin123' || password === ADMIN_API_KEY) {
      return res.json({
        success: true,
        token: 'demo-admin-session-active',
        user: {
          id: 'admin_01',
          name: 'Gym Administrator',
          email: email || 'admin@brandgym.placeholder',
          role: 'admin'
        }
      });
    }
    return res.status(401).json({ error: 'Invalid admin credentials. (Hint: Demo password is "admin123")' });
  }

  // Member login
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  return res.json({
    success: true,
    token: `member_token_${Date.now()}`,
    user: {
      id: 'usr_devansh',
      name: 'Devansh K.',
      email: email,
      role: 'member',
      membershipPlan: 'Quarterly All-Access',
      membershipStatus: 'ACTIVE',
      expiryDate: '2027-02-15',
      memberSince: '2026-08-15'
    }
  });
});

// ---------------------------------------------------------------------------
// Protected Administrative Endpoints
// ---------------------------------------------------------------------------

// A. Get All Inquiries (Admin)
app.get('/api/admin/inquiries', verifyAdmin, (_req: Request, res: Response) => {
  res.json({ inquiries });
});

// B. Update Inquiry Status & Notes (Admin)
app.patch('/api/admin/inquiries/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const inq = inquiries.find(i => i.id === id);
  if (!inq) {
    return res.status(404).json({ error: 'Inquiry record not found.' });
  }

  if (status) inq.status = status;
  if (notes !== undefined) inq.notes = notes;

  res.json({ success: true, inquiry: inq });
});

// C. Moderate Transformation Submissions (Admin)
app.get('/api/admin/transformations', verifyAdmin, (_req: Request, res: Response) => {
  res.json({ transformations });
});

app.patch('/api/admin/transformations/:id/moderate', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, moderationNotes } = req.body;

  const trans = transformations.find(t => t.id === id);
  if (!trans) {
    return res.status(404).json({ error: 'Transformation item not found.' });
  }

  if (status && ['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
    trans.status = status;
  }
  if (moderationNotes) {
    trans.moderationNotes = moderationNotes;
  }

  res.json({ success: true, transformation: trans });
});

// D. Get Financial & Payment Logs (Admin)
app.get('/api/admin/payments', verifyAdmin, (_req: Request, res: Response) => {
  res.json({ payments: paymentRecords });
});

// E. Admin Dashboard Analytics Summary
app.get('/api/admin/stats', verifyAdmin, (_req: Request, res: Response) => {
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'NEW').length;
  const approvedTransformations = transformations.filter(t => t.status === 'APPROVED').length;
  const pendingModerations = transformations.filter(t => t.status === 'PENDING').length;
  const totalRevenue = paymentRecords.reduce((acc, p) => acc + (p.status === 'SUCCESS' ? p.amount : 0), 0);

  res.json({
    stats: {
      totalInquiries,
      newInquiries,
      approvedTransformations,
      pendingModerations,
      activeMembersCount: 48, // placeholder count
      totalRevenue,
      currency: 'INR'
    }
  });
});

// ---------------------------------------------------------------------------
// Vite Integration for Dev / Static Serving for Production
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[GYM SERVER] Athletic club fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[GYM SERVER ERROR]', err);
});
