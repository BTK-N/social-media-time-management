import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import { GrowthRing, TrendChart } from '../components/nature';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockHistory = [
  { id: 1, date: 'Oct 12, 2026', score: 2.1, risk: 'Medium', notes: 'Slight improvement in morning scrolling.' },
  { id: 2, date: 'Oct 5, 2026', score: 3.5, risk: 'High', notes: 'Feeling overwhelmed, need to step back.' },
  { id: 3, date: 'Sep 28, 2026', score: 1.2, risk: 'Low', notes: 'A very grounded week.' },
];

export default function History() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full motion-root">
      <PageHeader 
        eyebrow={t('history.eyebrow', 'Reflection')}
        title={t('history.title', 'Growth rings')} 
        subtitle={t('history.subtitle', 'Look back at your seasons of growth and observe the patterns.')}
      />

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-24 mt-8 px-4 lg:px-8">
        {/* Left: Timeline */}
        <div className="flex-1 max-w-2xl relative before:absolute before:inset-y-0 before:left-[35px] md:before:left-[115px] before:w-[1px] before:bg-sage-200/60:bg-sage-800/60 rtl:before:left-auto rtl:before:right-[35px] md:rtl:before:right-[115px]">
          <div className="space-y-6">
        {mockHistory.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4 md:gap-8">
            <div className="hidden md:flex flex-col items-end w-[80px] shrink-0 pt-2 opacity-60">
              <span className="font-mono text-xs uppercase tracking-wider">{item.date.split(',')[0]}</span>
              <span className="font-mono text-[10px]">{item.date.split(',')[1]}</span>
            </div>
            
            <div className="relative z-10 w-10 h-10 shrink-0 bg-canvas rounded-full flex items-center justify-center ring-4 ring-canvas mt-1">
              <GrowthRing 
                value={item.score} 
                risk={item.risk === 'High' ? 'tangled' : item.risk === 'Medium' ? 'shallow' : 'deep'}
                size="sm"
              />
            </div>
            
            <div className="flex-1 bg-surface border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="md:hidden flex items-center gap-1.5 text-muted text-xs font-mono uppercase tracking-wider mb-3">
                <Calendar size={12} />
                <span>{item.date}</span>
              </div>
              
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Risk Level
                  </span>
                  <span className={`text-lg font-medium ${
                    item.risk === 'High' ? 'text-[var(--risk-tangled)]' :
                    item.risk === 'Medium' ? 'text-[var(--risk-shallow)]' :
                    'text-[var(--risk-deep)]'
                  }`}>
                    {item.risk} (Score: {item.score})
                  </span>
                </div>
                <ArrowRight size={18} className="text-sage-300 group-hover:text-secondary transition-colors transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </div>
              
              <p className="text-secondary text-sm mt-3 pt-3 border-t border-sage-100">
                "{item.notes}"
              </p>
            </div>
          </div>
        ))}
        </div>

          <div className="mt-12 text-center pb-12">
            <Link to="/diagnosis" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-medium transition-colors focus-visible:outline-none focus-visible:underline">
              <Calendar size={16} />
              {t('history.new', 'Take a new reading')}
            </Link>
          </div>
        </div>

        {/* Right: Trend Chart */}
        <div className="hidden lg:block w-80 shrink-0 sticky top-24 self-start pb-24">
          <TrendChart data={mockHistory.slice().reverse()} />
        </div>
      </div>
    </div>
  );
}
