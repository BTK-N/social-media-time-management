import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { useConfigStore } from '../../lib/store';

export function LanguagePill({ className, variant = 'light' }: { className?: string, variant?: 'light' | 'dark' }) {
  const { i18n } = useTranslation();
  const setLanguage = useConfigStore(s => s.setLanguage);

  const isUrdu = i18n.language.startsWith('ur');

  const handleToggle = () => {
    const nextLang = isUrdu ? 'en' : 'ur';
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]",
        variant === 'light' 
          ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--color-sage-100)]"
          : "border-[var(--color-charcoal-700)] bg-[var(--color-charcoal-800)] text-[var(--color-sand-100)] hover:bg-[var(--color-charcoal-700)]",
        className
      )}
      aria-label="Toggle language"
    >
      <span className={cn("transition-opacity", !isUrdu ? (variant === 'light' ? "opacity-100 font-bold text-primary" : "opacity-100 font-bold text-white") : "opacity-60")}>
        EN
      </span>
      <span className="opacity-30">·</span>
      <span className={cn("font-urdu transition-opacity", isUrdu ? (variant === 'light' ? "opacity-100 font-bold text-primary" : "opacity-100 font-bold text-white") : "opacity-60")}>
        اردو
      </span>
    </button>
  );
}
