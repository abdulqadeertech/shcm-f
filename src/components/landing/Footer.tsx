import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  CalendarDays,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { UTILITY_BAR_CONFIG } from '../../data/navigationData';
import { BrandLogo } from '../common/BrandLogo';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

interface FooterProps {
  onRequestDemo: () => void;
  onOpenWiki: () => void;
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onRequestDemo,
  onOpenWiki,
  onOpenSupport,
}) => {
  const { language, setLanguage } = useTranslation();

  return (
    <footer className="bg-[#051720] text-slate-300 border-t border-[#0d3448] text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Contact (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex">
              <BrandLogo size="md" />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SmartHCM is a Human Capital Management platform unifying employee records, biometric attendance, payroll processing, and approval workflows into a single workspace.
            </p>

            {/* Direct Contact Details */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail size={13} className="text-[#ff6f32] shrink-0" />
                <a href="mailto:aq0871633@gmail.com" className="hover:text-white transition">
                  aq0871633@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={13} className="text-[#ff6f32] shrink-0" />
                <div className="space-x-1.5">
                  <a href="tel:+923373029707" className="hover:text-white transition">
                    0337-3029707
                  </a>
                  <span>/</span>
                  <a href="tel:+923273726496" className="hover:text-white transition">
                    0327-3726496
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#25D366] text-xs font-bold">💬</span>
                <a
                  href="https://wa.me/923373029707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  WhatsApp: +92 337 3029707 / +92 327 3726496
                </a>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock size={13} className="text-slate-500 shrink-0" />
                <span>24/7 Direct Online Inquiries & WhatsApp Support</span>
              </div>
            </div>


            <div className="pt-2">
              <button
                onClick={onRequestDemo}
                className="bg-[#ff6f32] hover:bg-[#ea580c] text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center space-x-1.5 shadow-xs group cursor-pointer"
              >
                <CalendarDays size={13} />
                <span>Book a Demo</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Platform Modules (Col 2) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/employees" className="hover:text-white transition">
                  Core HR & Records
                </Link>
              </li>
              <li>
                <Link to="/attendance" className="hover:text-white transition">
                  Biometric Attendance
                </Link>
              </li>
              <li>
                <Link to="/leaves" className="hover:text-white transition">
                  Leave Management
                </Link>
              </li>
              <li>
                <Link to="/payroll" className="hover:text-white transition">
                  Payroll & Tax Engine
                </Link>
              </li>
              <li>
                <Link to="/recruitment" className="hover:text-white transition">
                  Recruitment & ATS
                </Link>
              </li>
              <li>
                <Link to="/performance" className="hover:text-white transition">
                  Performance Reviews
                </Link>
              </li>
              <li>
                <Link to="/organization" className="hover:text-white transition">
                  Organization & Branches
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions (Col 3) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Small & Medium Businesses
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  High-Growth Scaleups
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Corporate HR Teams
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Multi-Location Groups
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition">
                  Distributed Workforces
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#ff6f32] transition font-medium text-slate-300">
                  Register Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support (Col 4) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Resources & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenWiki} className="hover:text-white transition text-left cursor-pointer">
                  HCM Knowledge Wiki
                </button>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white transition text-left cursor-pointer">
                  Contact Us & Global Offices
                </Link>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-white transition text-left cursor-pointer">
                  Customer Help Center
                </button>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition">
                  Security & Governance
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing & Plans
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Product Sandbox
                </Link>
              </li>
            </ul>

            {/* Language Selector */}
            <div className="pt-2">
              <label className="sr-only" htmlFor="footer-lang-select">
                Select Language
              </label>
              <div className="inline-flex items-center space-x-1.5 bg-[#071c26] border border-[#14425b] rounded-lg px-2.5 py-1 text-xs text-slate-300">
                <Globe size={13} className="text-[#ff6f32] shrink-0" />
                <select
                  id="footer-lang-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#08222f] text-white">
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Socials & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-[#0e3547] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} SmartHCM. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-5 text-slate-400">
              <a href="#trust" className="hover:text-white transition">Privacy Policy</a>
              <a href="#trust" className="hover:text-white transition">Terms of Service</a>
              <a href="#trust" className="hover:text-white transition">Security</a>
            </div>

            <div className="flex items-center space-x-2 border-l border-[#12394d] pl-4">
              {UTILITY_BAR_CONFIG.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-white/5 transition"
                  title={social.label}
                  aria-label={social.label}
                >
                  {social.platform === 'linkedin' && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )}
                  {social.platform === 'twitter' && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social.platform === 'facebook' && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  )}
                  {social.platform === 'youtube' && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
