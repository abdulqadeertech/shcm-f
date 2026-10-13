import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronDown,
  CalendarDays,
  Search,
  MessageCircle,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import {
  MEGA_MENU_MODULES,
  UTILITY_BAR_CONFIG,
} from '../../data/navigationData';
import { DynamicIcon } from '../common/DynamicIcon';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDemo: () => void;
  onOpenSearch: () => void;
  onOpenWiki: () => void;
  onOpenSupport: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onRequestDemo,
  onOpenSearch,
  onOpenWiki,
  onOpenSupport,
}) => {
  const [modulesExpanded, setModulesExpanded] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-fadeIn lg:hidden">
      <div
        className="relative bg-[#08222f] border-l border-[#14425b] w-full max-w-sm h-full shadow-2xl flex flex-col text-left overflow-y-auto text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#0f3446] flex items-center justify-between bg-[#071c26] text-white">
          <BrandLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action CTAs */}
        <div className="p-4 border-b border-[#0f3446] space-y-2 bg-[#071c26]">
          <button
            onClick={() => {
              onClose();
              onRequestDemo();
            }}
            className="w-full bg-[#ff6f32] hover:bg-[#ea580c] text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <CalendarDays size={14} className="text-white" />
            <span>Book a Demo</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="p-2 border border-[#14425b] bg-[#0a2736] rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0c2f42] flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Search size={14} className="text-[#ff6f32]" />
              <span>Search</span>
            </button>
            <a
              href={UTILITY_BAR_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-emerald-800/80 bg-emerald-950/60 text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 hover:bg-emerald-900/60 transition"
            >
              <MessageCircle size={14} className="text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Accordion for Modules */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <button
              onClick={() => setModulesExpanded(!modulesExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider py-1 cursor-pointer"
            >
              <span>Platform Modules</span>
              <ChevronDown
                size={16}
                className={`transition-transform text-[#ff6f32] ${modulesExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {modulesExpanded && (
              <div className="mt-2 space-y-1">
                {MEGA_MENU_MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => handleNav(mod.path)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center space-x-3 transition group cursor-pointer"
                  >
                    <div className="shrink-0 text-[#ff6f32]">
                      <DynamicIcon name={mod.iconName} size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white group-hover:text-[#ff6f32] truncate">
                        {mod.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{mod.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="border-t border-[#0f3446] pt-3 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Workspace Access
            </div>
            <button
              onClick={() => handleNav('/dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-2 cursor-pointer"
            >
              <LayoutDashboard size={15} className="text-[#ff6f32]" />
              <span>Open HR Portal</span>
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => handleNav('/login')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-2 cursor-pointer"
              >
                <LogIn size={15} className="text-slate-400" />
                <span>Sign In</span>
              </button>
            ) : null}
          </div>

          {/* Help & Support */}
          <div className="border-t border-[#0f3446] pt-3 space-y-1 text-xs text-slate-300">
            <button
              onClick={() => {
                onClose();
                onOpenWiki();
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen size={14} className="text-[#ff6f32]" />
              <span>Knowledge Wiki</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSupport();
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg flex items-center space-x-2 cursor-pointer"
            >
              <HelpCircle size={14} className="text-[#ff6f32]" />
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
