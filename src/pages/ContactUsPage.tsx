import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Building2,
  Globe2,
  Users,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { MainNavbar } from '../components/navigation/MainNavbar';
import { Footer } from '../components/landing/Footer';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { leadService } from '../services/leadService';
import { useToast } from '../context/ToastContext';
import { RequestDemoModal } from '../components/modals/RequestDemoModal';
import { ContactSalesModal } from '../components/modals/ContactSalesModal';
import { SearchModal } from '../components/modals/SearchModal';
import { WikiDrawer } from '../components/modals/WikiDrawer';
import { SupportModal } from '../components/modals/SupportModal';
import { MobileNavDrawer } from '../components/navigation/MobileNavDrawer';
import { OWNER_CONTACT } from '../data/navigationData';

interface OfficeLocation {
  country: string;
  region: 'pakistan' | 'middle-east' | 'gulf' | 'uk-africa';
  city: string;
  address: string;
  phones: string[];
  email: string;
  isHeadquarter?: boolean;
}

const GLOBAL_OFFICES: OfficeLocation[] = [
  // Pakistan
  {
    country: 'Pakistan',
    region: 'pakistan',
    city: 'Karachi (Regional HQ)',
    address: '808, Anum Estate Building, Shahrah-e-Faisal, Karachi – 75350, Pakistan',
    phones: ['0337-3029707', '0327-3726496', '+92-337-3029707'],
    email: 'aq0871633@gmail.com',
    isHeadquarter: true,
  },
  {
    country: 'Pakistan',
    region: 'pakistan',
    city: 'Islamabad',
    address: '14, F-8 Markaz MPCHS, Islamabad – 44000, Pakistan',
    phones: ['0337-3029707', '0327-3726496'],
    email: 'aq0871633@gmail.com',
  },
  {
    country: 'Pakistan',
    region: 'pakistan',
    city: 'Lahore',
    address: '22S, Imperial Commercial Block, Paragon City Barki Road, Lahore – 53200, Pakistan',
    phones: ['0337-3029707', '0327-3726496'],
    email: 'aq0871633@gmail.com',
  },


  // Saudi Arabia & UAE
  {
    country: 'UAE',
    region: 'middle-east',
    city: 'Dubai',
    address: 'SmartHCM Cloud LLC FZ, Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba, Dubai, UAE',
    phones: ['+971-4-549-0431'],
    email: 'dubai@smarthcm.cloud',
    isHeadquarter: true,
  },
  {
    country: 'Saudi Arabia',
    region: 'middle-east',
    city: 'Riyadh',
    address: 'Office 4027, 2nd Floor, King Fahad Road Center Point Olaya View Tower, Olaya St, Riyadh 12554, KSA',
    phones: ['+966-59-677-2309', '+966-59-613-9255'],
    email: 'riyadh@smarthcm.cloud',
  },
  {
    country: 'Saudi Arabia',
    region: 'middle-east',
    city: 'Jeddah',
    address: 'Al-Farsi Tower, Al-Jazeerah Street, Al-Hamra, Jeddah, Kingdom of Saudi Arabia',
    phones: ['+966-59-677-2309', '+966-59-613-9255'],
    email: 'jeddah@smarthcm.cloud',
  },

  // Gulf
  {
    country: 'Kingdom of Bahrain',
    region: 'gulf',
    city: 'Budayia',
    address: 'Building 1292, Road 3833, Block 538, Budayia, Kingdom of Bahrain',
    phones: ['+973-3-931-2616'],
    email: 'bahrain@smarthcm.cloud',
  },
  {
    country: 'Sultanate of Oman',
    region: 'gulf',
    city: 'Muscat',
    address: 'Office No. 501, 5th Floor, City Season Hotel, Muscat, Oman',
    phones: ['+968-9-402-5757'],
    email: 'oman@smarthcm.cloud',
  },

  // UK & Africa
  {
    country: 'United Kingdom',
    region: 'uk-africa',
    city: 'Leeds',
    address: '28, Calverley Moor Avenue, Leeds West, Yorkshire LS28 8EL, United Kingdom',
    phones: ['+44-7428-339960'],
    email: 'uk@smarthcm.cloud',
  },
  {
    country: 'Nigeria',
    region: 'uk-africa',
    city: 'Port Harcourt',
    address: 'Multiskills Nigeria Limited, 13A Bishop Dimeari Road, Elechi 500272, Port Harcourt, Nigeria',
    phones: ['+234-809-595-6786'],
    email: 'nigeria@smarthcm.cloud',
  },
  {
    country: 'Nigeria',
    region: 'uk-africa',
    city: 'Ikeja Lagos',
    address: 'Mazars Building 2nd Floor, 18 Oba Akran Avenue, 100212 Ikeja Lagos, Nigeria',
    phones: ['+234-905-229-5559'],
    email: 'lagos@smarthcm.cloud',
  },
  {
    country: 'Ghana',
    region: 'uk-africa',
    city: 'Accra',
    address: '6th Floor, Ghana Multimedia House, JEA Mills High Street, P.O. Box GP 18187 Accra, Ghana',
    phones: ['+233-20-666-6669', '+233-55-380-3106'],
    email: 'ghana@smarthcm.cloud',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'SmartHCM is the perfect solution for HRMS practices. Payroll makes you feel completely free from trouble and the state-of-the-art mobile application facilitates information on fingertips. It reduced stationary costs to zero and provided a 100% paperless environment.',
    author: 'Mj (R) Jabir Zaheer',
    designation: 'Manager HR',
    organization: 'Ramada Hotel (Islamabad)',
    rating: 5,
  },
  {
    quote:
      'SmartHCM has revolutionized our management of leaves, attendance, and payroll across multiple factories. The most significant advantage has been the mobile application, which seamlessly facilitates remote employee check-ins and overtime validations.',
    author: 'Tehseena Hanif',
    designation: 'Asst. Manager HR',
    organization: 'Platinum Steel / Kopak Paints',
    rating: 5,
  },
  {
    quote:
      'One of our best software investments is SmartHCM. It is self-sufficient and actively used by our hospitals without any downtime. SmartHCM successfully managed everything for Tarabot Charity with dependable compliance.',
    author: 'Nasir Al Zahid',
    designation: 'Executive Director',
    organization: 'Tarabot Welfare Hospital Network',
    rating: 5,
  },
  {
    quote:
      'SmartHCM is an essential HR transformation and digitalization tool that significantly benefits employees, managers, and the organization. Our field medical representatives particularly value marking attendance and accessing leave from any territory.',
    author: 'Nausheen A. Aziz',
    designation: 'Group Head HR',
    organization: 'Hoora Pharma Group',
    rating: 5,
  },
];

export const ContactUsPage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [activeRegion, setActiveRegion] = useState<'all' | 'pakistan' | 'middle-east' | 'gulf' | 'uk-africa'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactSalesOpen, setContactSalesOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [wikiDrawerOpen, setWikiDrawerOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    whatsAppUrlPrimary: string;
    whatsAppUrlSecondary: string;
    mailtoUrl: string;
    emailSent: boolean;
  } | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    organizationName: '',
    phone: '',
    teamSize: '51-200 employees',
    moduleInterest: 'Enterprise Complete Suite',
    source: 'Google (search Engine)',
    message: '',
  });

  const filteredOffices =
    activeRegion === 'all'
      ? GLOBAL_OFFICES
      : GLOBAL_OFFICES.filter((office) => office.region === activeRegion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.organizationName.trim() || !form.phone.trim()) {
      toastError('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await leadService.submitInquiry({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        companyName: form.organizationName.trim(),
        phone: form.phone.trim(),
        teamSize: form.teamSize,
        moduleInterest: form.moduleInterest,
        source: form.source,
        message: form.message.trim() || 'Free consultation requested from Contact Us page.',
        type: 'CONTACT_US',
        status: 'NEW',
        notes: `Submitted via website contact page. Source: ${form.source}`,
      });

      setSubmissionResult({
        whatsAppUrlPrimary: result.whatsAppUrlPrimary,
        whatsAppUrlSecondary: result.whatsAppUrlSecondary,
        mailtoUrl: result.mailtoUrl,
        emailSent: result.emailSent,
      });

      setSubmitted(true);
      success('Inquiry submitted! Notification dispatched to aq0871633@gmail.com and WhatsApp delivery ready.', 'Message Sent');
    } catch (err) {
      toastError('Failed to dispatch inquiry. Please reach out via WhatsApp or call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmissionResult(null);
    setForm({
      fullName: '',
      email: '',
      organizationName: '',
      phone: '',
      teamSize: '51-200 employees',
      moduleInterest: 'Enterprise Complete Suite',
      source: 'Google (search Engine)',
      message: '',
    });
  };


  return (
    <div className="min-h-screen bg-[#051720] text-slate-100 flex flex-col selection:bg-[#ff6f32]/25 selection:text-white transition-colors">
      <MainNavbar
        onRequestDemo={() => setDemoModalOpen(true)}
        onApplyAsCompany={() => setDemoModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onContactSales={() => setContactSalesOpen(true)}
        onOpenWiki={() => setWikiDrawerOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
      />

      {/* Top Banner / Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-radial-gradient border-b border-[#0e3547]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08222f]/80 via-transparent to-[#051720] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <Breadcrumbs
            items={[
              { label: 'Platform Portal', to: '/portal' },
              { label: 'Contact & Global Presence' },
            ]}
          />

          <div className="mt-6 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ff6f32]/10 border border-[#ff6f32]/30 text-[#ff6f32] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={13} />
              <span>Global Reach • 24/7 Enterprise Consultation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Let’s Talk — Transform Your HR & Payroll Operations
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Whether you need a full enterprise product demonstration, multi-country payroll setup, biometric time-tracking terminals, or direct consultation for your company, our solution architects will provide tailored guidance.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#14425b]/60">
            {/* Phone 1 */}
            <div className="p-4 rounded-xl bg-[#08222f]/90 border border-[#14425b] flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#ff6f32]/15 text-[#ff6f32] border border-[#ff6f32]/30">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Call / WhatsApp 1</div>
                <a href="tel:+923373029707" className="text-xs sm:text-sm font-bold text-white hover:text-[#ff6f32] transition">
                  0337-3029707
                </a>
              </div>
            </div>

            {/* Phone / WhatsApp 2 */}
            <div className="p-4 rounded-xl bg-[#08222f]/90 border border-emerald-500/30 flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">WhatsApp / Call 2</div>
                <a
                  href="https://wa.me/923273726496?text=Hello%20SmartHCM%20team%2C%20I%20would%20like%20to%20inquire%20about%20the%20platform."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  0327-3726496
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-[#08222f]/90 border border-[#14425b] flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-slate-400">Direct Inquiries Email</div>
                <a href="mailto:aq0871633@gmail.com" className="text-xs sm:text-sm font-bold text-white hover:text-[#ff6f32] transition truncate block">
                  aq0871633@gmail.com
                </a>
              </div>
            </div>

            {/* SLA */}
            <div className="p-4 rounded-xl bg-[#08222f]/90 border border-[#14425b] flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#ff6f32]/15 text-[#ff6f32] border border-[#ff6f32]/30">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Direct Response SLA</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">
                  Instant on WhatsApp / 15m
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Main Content: Form & Offices Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#08222f] border border-[#14425b] rounded-2xl p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#ff6f32] uppercase tracking-wider mb-2">
              <MessageSquare size={14} />
              <span>Get Free Consultation of SmartHCM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Connect with Solution Architect
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
              Fill in your organization details below and our regional director will reach out with a tailored live architecture proposal.
            </p>

            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Consultation Request Dispatched!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{form.fullName}</strong>. Your message details for <strong className="text-white">{form.organizationName}</strong> have been recorded and emailed directly to <strong className="text-white">aq0871633@gmail.com</strong>.
                </p>

                {/* Direct Action: WhatsApp & Email Buttons */}
                <div className="p-4 rounded-xl bg-[#051822] border border-[#14425b] space-y-3 text-left">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <span className="text-emerald-400">⚡</span>
                    <span>Direct Action — Send Details to WhatsApp Now:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={submissionResult?.whatsAppUrlPrimary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md hover:shadow-emerald-500/25 transition cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp (0337-3029707)</span>
                    </a>

                    <a
                      href={submissionResult?.whatsAppUrlSecondary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-[#0b2b3c] hover:bg-[#14425b] border border-[#14425b] text-slate-200 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp (0327-3726496)</span>
                    </a>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-[#14425b]/60">
                    <div className="flex items-center space-x-2">
                      <Phone size={12} className="text-[#ff6f32]" />
                      <span>Direct Calls: <a href="tel:+923373029707" className="text-white hover:text-[#ff6f32]">0337-3029707</a> / <a href="tel:+923273726496" className="text-white hover:text-[#ff6f32]">0327-3726496</a></span>
                    </div>
                    {submissionResult?.mailtoUrl && (
                      <a href={submissionResult.mailtoUrl} className="text-sky-400 hover:underline">
                        Open in Email App
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-[#ff6f32] hover:bg-[#ea580c] text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>

            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name <span className="text-[#ff6f32]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32] focus:ring-1 focus:ring-[#ff6f32] transition"
                  />
                </div>

                {/* Organization Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Organization Name <span className="text-[#ff6f32]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    placeholder="e.g. Apex Industrial Group"
                    className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32] focus:ring-1 focus:ring-[#ff6f32] transition"
                  />
                </div>

                {/* Contact Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contact Number <span className="text-[#ff6f32]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32] focus:ring-1 focus:ring-[#ff6f32] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official Email Address <span className="text-[#ff6f32]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32] focus:ring-1 focus:ring-[#ff6f32] transition"
                    />
                  </div>
                </div>

                {/* Team Size & Module Interest */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company Size
                    </label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white focus:outline-none focus:border-[#ff6f32] transition"
                    >
                      <option value="1-25 employees">1 - 25 employees (Startup)</option>
                      <option value="26-100 employees">26 - 100 employees (Growing)</option>
                      <option value="101-500 employees">101 - 500 employees (Mid-Market)</option>
                      <option value="500+ employees">500+ employees (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Suite Interest
                    </label>
                    <select
                      value={form.moduleInterest}
                      onChange={(e) => setForm({ ...form, moduleInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white focus:outline-none focus:border-[#ff6f32] transition"
                    >
                      <option value="Enterprise Complete Suite">Enterprise Complete Suite</option>
                      <option value="Payroll & Tax Automation">Payroll & Tax Engine</option>
                      <option value="Biometric Attendance & Shifts">Biometric & Shifts</option>
                      <option value="Leaves & Approval Workflows">Leaves & Workflows</option>
                      <option value="Recruitment & Onboarding">Recruitment & Applicant Tracking</option>
                      <option value="Mobile Self-Service App">Mobile Self-Service App</option>
                    </select>
                  </div>
                </div>

                {/* Where did you hear about us? */}
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Where did you hear about us? <span className="text-[#ff6f32]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Google (search Engine)',
                      'Social Media (LinkedIn, Facebook, Instagram. etc)',
                      'Events',
                      'Online Advertisement',
                      'Other source',
                    ].map((sourceOpt) => (
                      <label
                        key={sourceOpt}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                          form.source === sourceOpt
                            ? 'bg-[#ff6f32]/10 border-[#ff6f32] text-white'
                            : 'bg-[#051822] border-[#14425b] text-slate-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="source"
                          checked={form.source === sourceOpt}
                          onChange={() => setForm({ ...form, source: sourceOpt })}
                          className="text-[#ff6f32] focus:ring-[#ff6f32]"
                        />
                        <span className="truncate">{sourceOpt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Your Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your current HR workflows, number of branches, or custom integration needs..."
                    className="w-full px-3.5 py-2.5 bg-[#051822] border border-[#14425b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6f32] focus:ring-1 focus:ring-[#ff6f32] transition"
                  />
                </div>

                {/* Instant WhatsApp Quick Connect Option */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <MessageCircle size={15} className="text-emerald-400 shrink-0" />
                    <span>Prefer instant WhatsApp response?</span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <a
                      href="https://wa.me/923373029707?text=Hello%20SmartHCM%20team%2C%20I%20would%20like%20to%20consult%20about%20the%20platform."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition shadow-xs flex items-center space-x-1"
                    >
                      <span>WhatsApp 0337</span>
                    </a>
                    <a
                      href="https://wa.me/923273726496?text=Hello%20SmartHCM%20team%2C%20I%20would%20like%20to%20consult%20about%20the%20platform."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#0b2b3c] hover:bg-[#14425b] border border-[#14425b] text-slate-200 hover:text-white text-[11px] font-bold transition flex items-center space-x-1"
                    >
                      <span>WhatsApp 0327</span>
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#ff6f32] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold text-xs tracking-wide uppercase transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >

                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting to Architects...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Strict confidentiality guaranteed. We never disclose your company data.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Global Locations & Headquarters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#14425b]">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center space-x-1">
                <Globe2 size={14} className="text-[#ff6f32]" />
                <span>Filter Region:</span>
              </span>
              {[
                { id: 'all', label: 'All Offices (11)' },
                { id: 'pakistan', label: 'Pakistan (3)' },
                { id: 'middle-east', label: 'Saudi Arabia & UAE (3)' },
                { id: 'gulf', label: 'Gulf (Bahrain/Oman)' },
                { id: 'uk-africa', label: 'UK & Africa' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRegion(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeRegion === tab.id
                      ? 'bg-[#ff6f32] text-white shadow-xs'
                      : 'bg-[#071c26] text-slate-300 hover:text-white border border-[#14425b]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Offices List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOffices.map((office, idx) => (
                <div
                  key={idx}
                  className="bg-[#08222f] border border-[#14425b] hover:border-[#ff6f32]/60 rounded-xl p-5 transition group relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#ff6f32] transition">
                          {office.country}
                        </span>
                        {office.isHeadquarter && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff6f32]/20 text-[#ff6f32] border border-[#ff6f32]/40">
                            Regional HQ
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-white mt-0.5">
                        {office.city}
                      </h4>
                    </div>
                    <div className="p-2 rounded-lg bg-[#071c26] border border-[#14425b] text-[#ff6f32] group-hover:scale-110 transition-transform">
                      <Building2 size={16} />
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-2 text-xs">
                    {/* Address */}
                    <div className="flex items-start space-x-2 text-slate-300">
                      <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{office.address}</span>
                    </div>

                    {/* Phones */}
                    <div className="pt-1 space-y-1">
                      {office.phones.map((phoneNum, pIdx) => (
                        <div key={pIdx} className="flex items-center space-x-2">
                          <Phone size={13} className="text-[#ff6f32] shrink-0" />
                          <a
                            href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
                            className="text-slate-300 hover:text-[#ff6f32] transition font-medium"
                          >
                            {phoneNum}
                          </a>
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-2 pt-0.5">
                      <Mail size={13} className="text-sky-400 shrink-0" />
                      <a
                        href={`mailto:${office.email}`}
                        className="text-slate-400 hover:text-white transition"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Connect Quick Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b2b3c] to-[#071c26] border border-[#14425b] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Looking for Dedicated Multi-Tenant Private Cloud?</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                  We deploy isolated tenant instances across AWS Bahrain, UAE, and European regions with full data sovereignty.
                </p>
              </div>
              <button
                onClick={() => setContactSalesOpen(true)}
                className="shrink-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
              >
                Speak with Enterprise Lead
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Testimonials (What People Say About SmartHCM) */}
      <section className="py-14 bg-[#071c26]/60 border-t border-b border-[#0e3547] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#ff6f32] uppercase tracking-wider">
              Proven Trust & Social Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              What People Say About SmartHCM
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Endorsed by enterprise HR directors, hospitality leaders, and health networks across multiple nations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#08222f] border border-[#14425b] rounded-2xl p-5 flex flex-col justify-between shadow-md hover:border-[#ff6f32]/40 transition"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-3 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#14425b]/60">
                  <div className="text-xs font-bold text-white">{t.author}</div>
                  <div className="text-[11px] text-[#ff6f32]">{t.designation}</div>
                  <div className="text-[11px] text-slate-400 truncate">{t.organization}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <RequestDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <ContactSalesModal
        isOpen={contactSalesOpen}
        onClose={() => setContactSalesOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <WikiDrawer
        isOpen={wikiDrawerOpen}
        onClose={() => setWikiDrawerOpen(false)}
      />

      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onRequestDemo={() => {
          setMobileMenuOpen(false);
          setDemoModalOpen(true);
        }}
        onOpenSearch={() => {
          setMobileMenuOpen(false);
          setSearchModalOpen(true);
        }}
        onOpenWiki={() => {
          setMobileMenuOpen(false);
          setWikiDrawerOpen(true);
        }}
        onOpenSupport={() => {
          setMobileMenuOpen(false);
          setSupportModalOpen(true);
        }}
      />

      <Footer
        onRequestDemo={() => setDemoModalOpen(true)}
        onOpenWiki={() => setWikiDrawerOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
      />
    </div>
  );
};
