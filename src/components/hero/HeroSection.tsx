import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  ArrowRight,
  Users,
  Clock,
  CreditCard,
} from 'lucide-react';

interface HeroSectionProps {
  onRequestDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRequestDemo,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full min-h-[560px] lg:min-h-[620px] flex items-center overflow-hidden bg-[#071c26] dark-surface-lock">
      {/* Corporate Workplace Photograph */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=85"
            alt="Corporate team collaborating in a modern workplace"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-[#071c26]" />
        )}

        {/* Dark Teal Photographic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051720]/95 via-[#08222f]/88 to-[#051720]/75 z-1" />
      </div>

      {/* Main Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline, Copy & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.12]">
              Bring Your People and Business Into{' '}
              <span className="text-[#ff6f32]">Better Alignment</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              Manage your workforce, payroll, attendance, and people operations through one connected Human Capital Management platform.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onRequestDemo}
                className="bg-[#ff6f32] hover:bg-[#ea580c] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-colors duration-150 flex items-center space-x-2 cursor-pointer group"
                aria-label="Book a Demo"
              >
                <CalendarDays size={18} className="text-white" />
                <span>Book a Demo</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="#platform"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-xs transition-colors duration-150 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore the Platform</span>
              </a>

              <Link
                to="/register"
                className="text-xs sm:text-sm text-slate-300 hover:text-white underline underline-offset-4 font-medium transition"
              >
                Register Company Workspace →
              </Link>
            </div>
          </div>

          {/* Right Column: Operational Highlights Card (5 cols) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-[#08222f]/90 border border-[#14425b] rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4 text-left text-white">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-[#051822]/80 border border-[#14425b] rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Active Headcount</span>
                    <Users size={14} className="text-[#ff6f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-1.5">1,428</div>
                  <div className="text-[11px] text-emerald-400 mt-1">98.4% Present Today</div>
                </div>

                <div className="bg-[#051822]/80 border border-[#14425b] rounded-xl p-3.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Monthly Payroll</span>
                    <CreditCard size={14} className="text-teal-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-1.5">$512.4K</div>
                  <div className="text-[11px] text-teal-300 mt-1">Tax Batch Reconciled</div>
                </div>
              </div>

              {/* Operational Verification */}
              <div className="bg-[#051822]/70 border border-[#14425b] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Clock size={13} className="text-[#ff6f32]" />
                    <span>Biometric Terminal Sync</span>
                  </span>
                  <span className="text-emerald-400 text-[11px] font-semibold">12/12 Online</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#ff6f32] h-full rounded-full w-[98%]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>SOC 2 Compliant</span>
                <Link
                  to="/dashboard"
                  className="text-[#ff6f32] hover:text-[#ff854d] font-semibold text-xs flex items-center space-x-1"
                >
                  <span>Open Live Sandbox</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
