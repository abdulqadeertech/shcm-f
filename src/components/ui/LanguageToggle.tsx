import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export const LanguageToggle: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-[#0a2736] hover:bg-[#0c2f42] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs border border-[#14425b] hover:border-[#ff6f32]/40 transition cursor-pointer shadow-xs"
        title={language === 'ur' ? 'زبان تبدیل کریں' : 'Change Language'}
        aria-label="Toggle language selector"
      >
        <Globe size={14} className="text-slate-400 shrink-0" />
        <span className="font-semibold text-xs tracking-wider">
          {compact ? currentLang.code.toUpperCase() : currentLang.nativeName}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRtl ? 'left-0' : 'right-0'
          } mt-2 w-36 bg-[#08222f] border border-[#14425b] rounded-xl shadow-2xl py-1 z-50 text-xs animate-dropdown-slide`}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#ff6f32]/10 transition cursor-pointer ${
                language === lang.code ? 'text-[#ff6f32] font-bold' : 'text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </span>
              {language === lang.code && <Check size={13} className="text-[#ff6f32]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
