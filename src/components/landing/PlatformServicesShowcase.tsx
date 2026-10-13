import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Clock,
  CalendarCheck,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Laptop,
} from 'lucide-react';

interface PlatformServicesShowcaseProps {
  onRequestDemo?: (moduleName?: string) => void;
}

export const PlatformServicesShowcase: React.FC<PlatformServicesShowcaseProps> = ({
  onRequestDemo,
}) => {
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  const capabilities = [
    {
      title: 'Attendance & Shifts',
      description:
        'Biometric hardware terminal integration, multi-shift rotating schedules, grace periods, and GPS mobile check-ins.',
      icon: Clock,
      path: '/attendance',
    },
    {
      title: 'Leave Management',
      description:
        'Multi-level approval chains, automated statutory leave balance accruals, and centralized holiday calendars.',
      icon: CalendarCheck,
      path: '/leaves',
    },
    {
      title: 'Overtime Management',
      description:
        'Configurable overtime policies with automatic overtime multiplier calculation based on verified biometric punch logs.',
      icon: Calculator,
      path: '/attendance',
    },
    {
      title: 'Recruitment & Onboarding',
      description:
        'End-to-end applicant tracking (ATS), vacancy management, interview feedback, and automated digital offer generation.',
      icon: Briefcase,
      path: '/recruitment',
    },
    {
      title: 'Performance & Training',
      description:
        'Quarterly OKR tracking, 360-degree appraisal cycles, skill matrices, and corporate compliance course enrollments.',
      icon: TrendingUp,
      path: '/performance',
    },
    {
      title: 'Company Assets & IT Hardware',
      description:
        'Hardware serial registration, custodian employee assignment, warranty tracking, and automated offboarding return receipts.',
      icon: Laptop,
      path: '/assets',
    },
  ];

  return (
    <section id="platform" className="py-20 lg:py-24 bg-[#071c26] border-t border-[#0e3547] text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-[1.15]">
            Everything Your People Operations Need
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Consolidate your entire HR ecosystem into an integrated suite of 12 enterprise-grade modules designed to power every stage of your workforce lifecycle.
          </p>
        </div>

        {/* 1. FEATURED SPLIT MODULE: Core HR & Employee Records & Self-Service */}
        <div className="bg-[#08222f] rounded-2xl border border-[#14425b] p-8 lg:p-10 shadow-lg mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Workplace Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#051822] shadow-md border border-[#14425b]">
                {!img1Error ? (
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                    alt="Corporate HR team managing digital workforce records"
                    onError={() => setImg1Error(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0a2736] flex items-center justify-center p-6 text-white text-center">
                    <div>
                      <Users size={32} className="text-[#ff6f32] mx-auto mb-2" />
                      <span className="text-sm font-semibold">Digital Employee Records</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Editorial Features */}
            <div className="lg:col-span-7 text-left space-y-5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Core HR, Employee Records & Self-Service Portal
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Establish an immaculate digital single-source-of-truth for your entire organization. Employees update personal profiles and download documentation, while HR managers manage designation tiers, reporting trees, and department allocations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#051822] p-4 rounded-xl border border-[#14425b]">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                    <CheckCircle2 size={16} className="text-[#ff6f32]" />
                    <span>Employee Records</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Passports, tax IDs, banking details, and past employment history stored securely.
                  </p>
                </div>

                <div className="bg-[#051822] p-4 rounded-xl border border-[#14425b]">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                    <CheckCircle2 size={16} className="text-[#ff6f32]" />
                    <span>Company Administration</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Granular role-based permissions (Super Admin, HR Manager, Supervisor, Employee).
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-4">
                <Link
                  to="/employees"
                  className="bg-[#ff6f32] hover:bg-[#ea580c] text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center space-x-2 shadow-sm"
                >
                  <span>View Employee Directory</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  onClick={() => onRequestDemo?.('Core HR')}
                  className="text-xs font-bold text-[#ff6f32] hover:text-[#ea580c] transition cursor-pointer"
                >
                  Request Core HR Demo →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FEATURED SPLIT MODULE: Payroll, Payslips & Final Settlement (Inverted) */}
        <div className="bg-[#08222f] rounded-2xl border border-[#14425b] p-8 lg:p-10 shadow-lg mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left space-y-5 order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Payroll, Payslips & End-of-Service Final Settlement
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Eliminate calculation errors and manual recalculations. SmartHCM automatically compiles verified biometric attendance hours, applies statutory tax withholding slabs, factors in allowances and deductions, and generates audit-ready bank transfer files.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#051822] p-4 rounded-xl border border-[#14425b]">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                    <CheckCircle2 size={16} className="text-[#ff6f32]" />
                    <span>Automated Payslips</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    PDF generation and immediate self-service distribution to employee portals.
                  </p>
                </div>

                <div className="bg-[#051822] p-4 rounded-xl border border-[#14425b]">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                    <CheckCircle2 size={16} className="text-[#ff6f32]" />
                    <span>Final Settlement Gratuity</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    End-of-service gratuity formulas, accrued leave encashment & asset clearance.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-4">
                <Link
                  to="/payroll"
                  className="bg-[#ff6f32] hover:bg-[#ea580c] text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center space-x-2 shadow-sm"
                >
                  <span>Inspect Payroll Engine</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  onClick={() => onRequestDemo?.('Payroll')}
                  className="text-xs font-bold text-[#ff6f32] hover:text-[#ea580c] transition cursor-pointer"
                >
                  Request Payroll Demo →
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#051822] shadow-md border border-[#14425b]">
                {!img2Error ? (
                  <img
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80"
                    alt="Corporate financial team reviewing payroll calculation metrics"
                    onError={() => setImg2Error(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0a2736] flex items-center justify-center p-6 text-white text-center">
                    <div>
                      <CreditCard size={32} className="text-[#ff6f32] mx-auto mb-2" />
                      <span className="text-sm font-semibold">Decimal-Safe Financial Engine</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. EDITORIAL 6-MODULE MATRIX FOR REMAINING CAPABILITIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="bg-[#08222f] rounded-xl p-6 border border-[#14425b] hover:border-[#ff6f32]/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#071c26] border border-[#14425b] text-[#ff6f32] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff6f32] transition-colors">
                    {cap.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {cap.description}
                  </p>
                </div>

                <Link
                  to={cap.path}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#ff6f32] hover:text-[#ea580c] transition-colors mt-auto"
                >
                  <span>Explore Module</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
