import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, X, ChevronUp, Sparkles } from 'lucide-react';
import { OWNER_CONTACT } from '../../data/navigationData';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = encodeURIComponent('Hello! I visited your SmartHCM website and would like to learn more about the HCM platform.');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-[#08222f] border border-[#14425b] rounded-2xl shadow-2xl p-4 text-left animate-fadeIn backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#14425b]">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                <MessageCircle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>SmartHCM Direct Support</span>
                  <Sparkles size={11} className="text-[#ff6f32]" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">Online • Instant Response</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
              aria-label="Close contact popup"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 my-2.5 leading-relaxed">
            Connect directly with our solutions team via WhatsApp, call, or email:
          </p>

          <div className="space-y-2">
            {/* WhatsApp 1 */}
            <a
              href={`https://wa.me/923373029707?text=${defaultMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-white transition group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-emerald-400 font-bold text-base">💬</span>
                <div>
                  <div className="text-xs font-bold group-hover:text-emerald-300 transition">WhatsApp 1 (Primary)</div>
                  <div className="text-[11px] text-slate-300 font-mono">+92 337 3029707</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Chat
              </span>
            </a>

            {/* WhatsApp 2 */}
            <a
              href={`https://wa.me/923273726496?text=${defaultMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b2b3c] hover:bg-[#14425b] border border-[#14425b] text-white transition group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-emerald-400 font-bold text-base">💬</span>
                <div>
                  <div className="text-xs font-bold group-hover:text-emerald-300 transition">WhatsApp 2 (Secondary)</div>
                  <div className="text-[11px] text-slate-300 font-mono">+92 327 3726496</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-[#051822] px-2 py-0.5 rounded-full border border-[#14425b]">
                Chat
              </span>
            </a>

            {/* Direct Phone Call */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+923373029707"
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[#051822] hover:bg-[#ff6f32]/15 border border-[#14425b] hover:border-[#ff6f32]/40 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <Phone size={12} className="text-[#ff6f32]" />
                <span>Call 0337</span>
              </a>
              <a
                href="tel:+923273726496"
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[#051822] hover:bg-[#ff6f32]/15 border border-[#14425b] hover:border-[#ff6f32]/40 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <Phone size={12} className="text-[#ff6f32]" />
                <span>Call 0327</span>
              </a>
            </div>

            {/* Direct Email */}
            <a
              href={`mailto:${OWNER_CONTACT.email}?subject=${encodeURIComponent('SmartHCM Solutions Inquiry')}`}
              className="flex items-center space-x-2 p-2 rounded-xl bg-[#051822] hover:bg-sky-500/10 border border-[#14425b] hover:border-sky-500/30 text-xs text-slate-300 hover:text-white transition"
            >
              <Mail size={13} className="text-sky-400 shrink-0" />
              <span className="truncate text-[11px] font-mono">{OWNER_CONTACT.email}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        aria-label="Direct WhatsApp & Call Contact"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <div className="flex items-center space-x-1.5">
          {/* Custom SVG WhatsApp Icon */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="text-xs font-bold tracking-tight">WhatsApp / Call</span>
        </div>
        <ChevronUp size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
