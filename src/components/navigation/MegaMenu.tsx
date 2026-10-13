import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MEGA_MENU_MODULES, MegaMenuModule } from '../../data/navigationData';
import { DynamicIcon } from '../common/DynamicIcon';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDemo: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onRequestDemo,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleModuleClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 right-0 z-50 bg-[#08222f] border-b border-[#14425b] shadow-2xl transition-all duration-200 animate-dropdown-slide text-left"
      role="region"
      aria-label="SmartHCM Modules Mega-Menu"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 max-h-[82vh] overflow-y-auto">
        {/* Top Header inside Mega-Menu */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#0f3446]">
          <span className="text-xs font-semibold text-slate-300">
            Platform Modules
          </span>
          <button
            onClick={() => {
              onClose();
              onRequestDemo();
            }}
            className="text-xs font-semibold text-[#ff6f32] hover:text-[#ea580c] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Request Guided Tour</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 4-Column Grid for Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MEGA_MENU_MODULES.map((module: MegaMenuModule) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
              className="group flex items-start space-x-3 p-3 rounded-xl border border-[#14425b] hover:border-[#ff6f32]/50 hover:bg-white/5 transition-colors duration-150 cursor-pointer text-left bg-[#0a2736]/60"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleModuleClick(module.path);
                }
              }}
            >
              <div className="mt-0.5 shrink-0 text-[#ff6f32]">
                <DynamicIcon
                  name={module.iconName}
                  size={18}
                  strokeWidth={2}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white group-hover:text-[#ff6f32] transition-colors leading-snug truncate mb-0.5">
                  {module.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Mega-Menu Footer Banner */}
        <div className="mt-5 pt-3.5 border-t border-[#0f3446] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={15} className="text-[#ff6f32] shrink-0" />
            <span>
              SOC 2 Type II, GDPR, and ISO 27001 aligned workforce management.
            </span>
          </div>

          <div className="flex items-center space-x-4 font-semibold text-xs">
            <Link
              to="/reports"
              onClick={onClose}
              className="text-slate-300 hover:text-white transition"
            >
              Analytics & Reports
            </Link>
            <button
              onClick={() => {
                onClose();
                onRequestDemo();
              }}
              className="text-[#ff6f32] hover:text-[#ea580c] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Schedule Demo</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
