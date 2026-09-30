import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import { Network, ArrowUpRight, ArrowDownRight, Wind, Download } from 'lucide-react';
import { Blob } from '../components/nature';
import { BreathingButton } from '../components/motion';

export default function Insights() {
  const { t } = useTranslation();

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full motion-root">
      <PageHeader 
        eyebrow={t('insights.eyebrow', 'Connections')}
        title={t('insights.title', 'The Mycelium Network')} 
        subtitle={t('insights.subtitle', 'Beneath the surface, patterns emerge. See how your habits connect.')}
        action={
          <BreathingButton onClick={handleExport} className="print:hidden flex items-center gap-2">
            <Download size={16} />
            {t('insights.export', 'Export PDF')}
          </BreathingButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Metric 1 */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Network size={100} />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-medium text-muted uppercase tracking-wider block mb-4">
              Focus Depth
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-display text-primary">4.2</span>
              <span className="text-muted font-medium text-sm">hrs/day</span>
            </div>
            <div className="flex items-center gap-1 text-secondary text-sm font-medium">
              <ArrowUpRight size={14} />
              <span>12% deeper than last week</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Wind size={100} />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-medium text-muted uppercase tracking-wider block mb-4">
              Distraction Drafts
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-display text-primary">18</span>
              <span className="text-muted font-medium text-sm">pickups</span>
            </div>
            <div className="flex items-center gap-1 text-secondary text-sm font-medium">
              <ArrowDownRight size={14} />
              <span>5 fewer drafts this week</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-sm md:col-span-1 md:row-span-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-muted uppercase tracking-wider block mb-4">
              Root Strength
            </span>
            <div className="text-6xl font-display text-primary mb-6">
              Strong
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Your evening routine has become a sturdy taproot. Consistent time away from screens before bed is significantly improving your overall rest.
            </p>
          </div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-surface flex items-center justify-center">
            <Blob color="var(--sage-400)" size={180} />
            <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10" />
            <span className="absolute text-secondary font-display italic text-lg z-10">
              Grounded
            </span>
          </div>
        </div>
        
        {/* Placeholder for larger chart */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-sm md:col-span-2 min-h-[240px] flex flex-col justify-center items-center text-center">
           <Network size={32} className="text-sage-300 mb-4" />
           <p className="font-display text-lg text-primary mb-2">
             Mycelium map forming...
           </p>
           <p className="text-sm text-muted max-w-[40ch]">
             As you continue to use the app, we will map the invisible connections between your app usage and your daily feelings.
           </p>
        </div>
      </div>
    </div>
  );
}
