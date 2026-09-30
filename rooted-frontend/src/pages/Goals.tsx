import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import { Seedling, Blob } from '../components/nature';

const mockGoals = [
  { id: 1, title: 'No social media before 10 AM', status: 'sprout', progress: 4, target: 7, days: 'Mon-Sun' },
  { id: 2, title: 'Under 1 hr total Instagram', status: 'seed', progress: 1, target: 5, days: 'Weekdays' },
  { id: 3, title: 'Read a book instead of scrolling', status: 'tree', progress: 14, target: 14, days: 'Daily' },
];

export default function Goals() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full motion-root">
      <PageHeader 
        eyebrow={t('goals.eyebrow', 'Cultivation')}
        title={t('goals.title', 'Tending the garden')} 
        subtitle={t('goals.subtitle', 'Plant intentions and nurture them with daily consistency.')}
        action={
          <button className="flex items-center gap-2 bg-sage-800 hover:bg-sage-900 text-sage-50 px-4 py-2 rounded-full font-medium transition-colors text-sm shadow-sm">
            <Plus size={16} />
            {t('goals.new', 'Plant a seed')}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {mockGoals.map((goal) => (
          <div 
            key={goal.id} 
            className="group relative bg-surface border border-border/50 rounded-2xl p-6 shadow-sm overflow-hidden hover:shadow-md hover:border-strong:border-sage-700 transition-all duration-300"
          >
            {/* Background Blob */}
            <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Blob color="var(--sage-500)" size={150} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-sage-100 p-2.5 rounded-xl text-secondary">
                    {goal.status === 'seed' ? <Target size={20} /> :
                     goal.status === 'sprout' ? <Seedling stage={2} size={20} className="text-secondary" /> :
                     <CheckCircle2 size={20} className="text-secondary" />}
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted bg-surface px-2 py-1 rounded-md">
                    {goal.days}
                  </span>
                </div>
                
                <h3 className="font-display text-lg text-primary leading-snug">
                  {goal.title}
                </h3>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-primary">
                    {goal.progress} / {goal.target} {t('goals.days', 'days')}
                  </span>
                  <span className="text-muted">
                    {Math.round((goal.progress / goal.target) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-sage-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sage-500 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State / Gardening context */}
      <div className="mt-12 p-8 border border-dashed border-strong rounded-2xl text-center bg-surface/50">
        <div className="w-12 h-12 mx-auto bg-sage-100 rounded-full flex items-center justify-center mb-4 text-muted">
          <Seedling stage={1} size={20} />
        </div>
        <h4 className="font-display text-lg text-primary mb-2">Space to grow</h4>
        <p className="text-secondary text-sm max-w-[40ch] mx-auto">
          Start small. True growth happens underground long before it's visible on the surface. What intention will you plant today?
        </p>
      </div>
    </div>
  );
}
