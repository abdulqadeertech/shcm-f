import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  Menu,
  CalendarDays,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  FileText,
  BookOpen,
  Code2,
  Globe2,
  Users2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogo } from '../common/BrandLogo';

interface MainNavbarProps {
  onRequestDemo: () => void;
  onApplyAsCompany: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onContactSales?: () => void;
  onOpenWiki?: () => void;
  onOpenSupport?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({
  onRequestDemo,
  onOpenSearch,
  onOpenMobileMenu,
  onContactSales,
  onOpenWiki,
  onOpenSupport,
}) => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const solutionsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  const isLandingPage =
    location.pathname === '/' ||
    location.pathname === '/home' ||
    location.pathname === '/portal' ||
    location.pathname === '/showcase';

  const handleNavClick = (anchorId: string) => {
    setMegaMenuOpen(false);
    setSolutionsDropdownOpen(false);
    setResourcesDropdownOpen(false);
    if (isLandingPage) {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/portal#${anchorId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="relative bg-[#071c26]/95 backdrop-blur-md border-b border-[#0e3547] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left Brand & Primary Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/"
              className="flex items-center py-1 rounded-lg focus-visible:outline-none"
              aria-label="SmartHCM Home"
            >
              <BrandLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 text-slate-300">
              <Link
                to="/portal"
                className="px-3 py-2 rounded-lg text-xs font-semibold hover:text-[#ff6f32] hover:bg-white/5 transition cursor-pointer"
              >
                Home
              </Link>

              {/* Platform Dropdown Trigger */}
              <button
                type="button"
                onClick={() => {
                  setMegaMenuOpen(!megaMenuOpen);
                  setSolutionsDropdownOpen(false);
                  setResourcesDropdownOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  megaMenuOpen
                    ? 'text-[#ff6f32] bg-[#ff6f32]/10'
                    : 'hover:text-[#ff6f32] hover:bg-white/5'
                }`}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
              >
                <span>Platform</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    megaMenuOpen ? 'rotate-180 text-[#ff6f32]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Solutions Dropdown */}
              <div className="relative" ref={solutionsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setSolutionsDropdownOpen(!solutionsDropdownOpen);
                    setMegaMenuOpen(false);
                    setResourcesDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    solutionsDropdownOpen
                      ? 'text-[#ff6f32] bg-[#ff6f32]/10'
                      : 'hover:text-[#ff6f32] hover:bg-white/5'
                  }`}
                >
                  <span>Solutions</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      solutionsDropdownOpen ? 'rotate-180 text-[#ff6f32]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {solutionsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-[#08222f] border border-[#14425b] rounded-xl shadow-xl py-2 z-50 text-left animate-dropdown-slide">
                    {[
                      {
                        title: 'Small & Medium Businesses',
                        desc: 'Automate core records and error-free payroll.',
                        icon: Users2,
                        id: 'solutions',
                      },
                      {
                        title: 'High-Growth Scaleups',
                        desc: 'Rapid hiring pipelines and digital onboarding.',
                        icon: Briefcase,
                        id: 'solutions',
                      },
                      {
                        title: 'Corporate HR Departments',
                        desc: 'Labor policies, hierarchies & compliance.',
                        icon: Building2,
                        id: 'solutions',
                      },
                      {
                        title: 'Multi-Location Organizations',
                        desc: 'Branch-level shifts, calendars & local tax codes.',
                        icon: Globe2,
                        id: 'solutions',
                      },
                      {
                        title: 'Distributed & Remote Teams',
                        desc: 'Geofenced mobile check-ins & self-service.',
                        icon: Layers,
                        id: 'solutions',
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleNavClick(item.id)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 flex items-start space-x-3 transition group cursor-pointer"
                        >
                          <Icon size={16} className="text-[#ff6f32] mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#ff6f32] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setResourcesDropdownOpen(!resourcesDropdownOpen);
                    setMegaMenuOpen(false);
                    setSolutionsDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    resourcesDropdownOpen
                      ? 'text-[#ff6f32] bg-[#ff6f32]/10'
                      : 'hover:text-[#ff6f32] hover:bg-white/5'
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      resourcesDropdownOpen ? 'rotate-180 text-[#ff6f32]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {resourcesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#08222f] border border-[#14425b] rounded-xl shadow-xl py-2 z-50 text-left animate-dropdown-slide">
                    {[
                      {
                        title: 'Statutory Compliance Hub',
                        desc: 'Security standards and governance.',
                        icon: ShieldCheck,
                        action: () => handleNavClick('trust'),
                      },
                      {
                        title: 'HCM Knowledge Wiki',
                        desc: 'Formulas, overtime laws & guides.',
                        icon: BookOpen,
                        action: () => (onOpenWiki ? onOpenWiki() : handleNavClick('faq')),
                      },
                      {
                        title: 'Implementation Process',
                        desc: '14-day structured migration guide.',
                        icon: FileText,
                        action: () => handleNavClick('how-it-works'),
                      },
                      {
                        title: 'Platform Capabilities',
                        desc: 'Biometric terminals and core modules.',
                        icon: Code2,
                        action: () => handleNavClick('platform'),
                      },
                      {
                        title: 'Customer Support',
                        desc: 'Help desk & technical assistance.',
                        icon: HelpCircle,
                        action: () => (onOpenSupport ? onOpenSupport() : handleNavClick('contact')),
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setResourcesDropdownOpen(false);
                            item.action();
                          }}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 flex items-start space-x-3 transition group cursor-pointer"
                        >
                          <Icon size={16} className="text-[#ff6f32] mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#ff6f32] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('pricing')}
                className="px-3 py-2 rounded-lg text-xs font-semibold hover:text-[#ff6f32] hover:bg-white/5 transition cursor-pointer"
              >
                Pricing
              </button>

              <button
                onClick={() => {
                  if (onContactSales) {
                    onContactSales();
                  } else {
                    handleNavClick('contact');
                  }
                }}
                className="px-3 py-2 rounded-lg text-xs font-semibold hover:text-[#ff6f32] hover:bg-white/5 transition cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-300 bg-[#0a2736] hover:bg-[#0c2f42] border border-[#14425b] hover:border-[#ff6f32]/40 text-xs font-medium items-center space-x-2 transition cursor-pointer"
              title="Search Modules (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={14} className="text-slate-400" />
              <span className="text-[11px] text-slate-400 font-mono">⌘K</span>
            </button>

            {/* User Session status or Log In */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#14425b] bg-[#0a2736] text-xs font-semibold text-slate-200 hover:border-[#ff6f32]/50 transition"
              >
                <div className="w-5 h-5 rounded-full bg-[#071c26] text-white border border-[#14425b] flex items-center justify-center text-[10px] font-bold">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <span className="hidden md:inline">{user?.firstName || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-[#ff6f32] hover:bg-white/5 transition"
              >
                <User size={14} className="text-slate-400" />
                <span>Log in</span>
              </Link>
            )}

            {/* Book a Demo Button */}
            <button
              onClick={onRequestDemo}
              className="bg-[#ff6f32] hover:bg-[#ea580c] text-white font-semibold text-xs py-2 px-3.5 sm:px-4 sm:py-2 rounded-lg shadow-xs transition-colors duration-150 flex items-center space-x-1.5 cursor-pointer group"
              aria-label="Book a Demo"
            >
              <CalendarDays size={14} className="text-white" />
              <span className="hidden sm:inline">Book a Demo</span>
              <span className="sm:hidden">Demo</span>
              <ArrowRight size={13} className="hidden sm:inline group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0a2736] border border-[#14425b] transition cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Mega-Menu */}
      <MegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onRequestDemo={onRequestDemo}
      />
    </nav>
  );
};
