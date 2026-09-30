import React, { useState } from 'react';
import { DiagnosisWizard } from '../components/diagnosis/DiagnosisWizard';
import { DiagnosisResult as ResultType } from '../lib/types';
import { useTranslation } from 'react-i18next';
import { GrowthRing } from '../components/nature';

export default function Diagnosis() {
  const { t } = useTranslation();
  const [result, setResult] = useState<ResultType | null>(null);

  if (!result) {
    return (
      <div className="pt-24 pb-12 px-6 flex flex-col justify-center min-h-[80vh]">
        <DiagnosisWizard onComplete={setResult} />
      </div>
    );
  }

  // Calculate percentage for the growth ring
  // Score is out of 5.
  const score = result.ml_results.overall_score;
  const progress = (score / 5) * 100;
  
  const handleDownload = () => {
    // Generate simple PDF mock or alert
    alert('PDF Generation will connect to backend endpoint soon!');
  };

  return (
    <div className="pt-24 pb-12 px-6 motion-breathe">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display text-primary tracking-wide mb-4">
            {t('diagnosis.result.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Visuals & Metrics */}
          <div className="flex flex-col items-center">
            <div className="relative flex justify-center mb-8">
              <GrowthRing 
                value={score} 
                risk={result.ml_results.predicted_risk === 'High' ? 'tangled' : result.ml_results.predicted_risk === 'Medium' ? 'shallow' : 'deep'}
                size={220}
              />
            </div>
            
            <div className="bg-canvas/50 backdrop-blur-md border border-border rounded-2xl p-6 w-full text-center shadow-sm">
              <span className="block text-sm text-muted uppercase tracking-wider mb-2">
                {t('diagnosis.result.risk')}
              </span>
              <span className={`text-2xl font-medium ${
                result.ml_results.predicted_risk === 'High' ? 'text-[var(--risk-tangled)]' :
                result.ml_results.predicted_risk === 'Medium' ? 'text-[var(--risk-shallow)]' :
                'text-[var(--risk-deep)]'
              }`}>
                {result.ml_results.predicted_risk}
              </span>
            </div>
          </div>

          {/* Right Column: AI Consultation */}
          <div className="bg-canvas/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-sm prose prose-sage">
            <h3 className="text-xl font-display text-primary mb-6 border-b border-border pb-4">
              {t('diagnosis.result.consultation')}
            </h3>
            
            <div className="text-secondary whitespace-pre-wrap leading-relaxed">
              {result.ai_consultation}
            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={handleDownload}
                className="px-6 py-3 rounded-full border border-strong text-secondary hover:bg-sage-100:bg-sage-800 transition-colors"
              >
                {t('diagnosis.result.download')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
