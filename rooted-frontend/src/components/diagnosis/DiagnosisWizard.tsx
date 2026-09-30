import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BreathingButton } from '../motion';
import { DiagnosisPayload, DiagnosisResult } from '../../lib/types';
import { ApiClient } from '../../lib/api';
import { storage } from '../../lib/storage';
import { useAuthStore } from '../../lib/store';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';

export function DiagnosisWizard({ onComplete }: { onComplete: (res: DiagnosisResult) => void }) {
  const { t } = useTranslation();
  const username = useAuthStore(s => s.user?.username);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState<DiagnosisPayload>({
    age: 22,
    gender: 1, // Male default in original
    relationship: 0,
    occupation: 1,
    org_type: 1,
    platforms: 3,
    usage_hours: 4.5,
    purposeless: 3,
    distracted: 4,
    restless: 2,
    concentration: 3,
    focus_issue: 4,
    comparison: 3,
    comparison_feelings: 2,
    validation: 4,
    interest_fluctuation: 3,
  });

  const updateData = (fields: Partial<DiagnosisPayload>) => setData((prev) => ({ ...prev, ...fields }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ApiClient.predictAndConsult(data);
      if (res.status === 'success') {
        // Save history
        await storage.history.append({
          username: username!,
          risk_level: res.ml_results.predicted_risk,
          impact_score: res.ml_results.overall_score,
          ai_consult: res.ai_consultation,
        });
        onComplete(res);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const InputRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border gap-4">
      <span className="text-primary font-medium">{label}</span>
      <div className="w-full sm:w-1/2 flex items-center">{children}</div>
    </div>
  );

  const SliderField = ({ label, value, onChange, min = 1, max = 5, labels }: any) => (
    <div className="py-2 border-b border-border">
      <div className="flex justify-between mb-2">
        <span className="text-primary font-medium">{label}</span>
        <span className="text-muted font-mono text-sm">{value}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={max > 5 ? 0.5 : 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        labels={labels}
      />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto motion-breathe">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-display text-primary tracking-wide mb-3">
          {t('diagnosis.title')}
        </h2>
        <p className="text-secondary">
          {t('diagnosis.subtitle')}
        </p>
      </div>

      <div className="bg-canvas/50 backdrop-blur-md border border-border rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-border pb-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-colors border ${
                step === i 
                  ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)] border-transparent' 
                  : step > i 
                    ? 'bg-[var(--color-sage-100)] text-[var(--text-primary)] border-transparent' 
                    : 'bg-transparent text-[var(--text-muted)] border-[var(--border-strong)]'
              }`}
            >
              {i}. {t(`diagnosis.step${i}.title`)}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-2 motion-breathe">
            <h3 className="text-xl font-display text-primary mb-6">{t('diagnosis.step1.title')}</h3>
            
            <InputRow label={t('diagnosis.step1.age')}>
              <Input 
                type="number" 
                value={data.age} 
                onChange={e => updateData({ age: Number(e.target.value) })}
                className="text-right border-none"
              />
            </InputRow>

            <InputRow label={t('diagnosis.step1.gender')}>
              <Select 
                value={data.gender} 
                onChange={e => updateData({ gender: Number(e.target.value) })}
                options={(t('diagnosis.step1.genderOptions', { returnObjects: true }) as string[]).map((opt, i) => ({ label: opt, value: i === 0 ? 0 : i === 1 ? 1 : 2 }))}
                className="text-right border-none"
              />
            </InputRow>

            <InputRow label={t('diagnosis.step1.relationship')}>
              <Select 
                value={data.relationship} 
                onChange={e => updateData({ relationship: Number(e.target.value) })}
                options={(t('diagnosis.step1.relationshipOptions', { returnObjects: true }) as string[]).map((opt, i) => ({ label: opt, value: i }))}
                className="text-right border-none"
              />
            </InputRow>

            <InputRow label={t('diagnosis.step1.occupation')}>
              <Select 
                value={data.occupation} 
                onChange={e => updateData({ occupation: Number(e.target.value) })}
                options={(t('diagnosis.step1.occupationOptions', { returnObjects: true }) as string[]).map((opt, i) => ({ label: opt, value: i }))}
                className="text-right border-none"
              />
            </InputRow>

            <InputRow label={t('diagnosis.step1.orgType')}>
              <Select 
                value={data.org_type} 
                onChange={e => updateData({ org_type: Number(e.target.value) })}
                options={(t('diagnosis.step1.orgTypeOptions', { returnObjects: true }) as string[]).map((opt, i) => ({ label: opt, value: i }))}
                className="text-right border-none"
              />
            </InputRow>

            <InputRow label={t('diagnosis.step1.platforms')}>
              <Input 
                type="number" 
                value={data.platforms} 
                onChange={e => updateData({ platforms: Number(e.target.value) })}
                min="0" max="20"
                className="text-right border-none"
              />
            </InputRow>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2 motion-breathe">
            <h3 className="text-xl font-display text-primary mb-6">{t('diagnosis.step2.title')}</h3>
            
            <SliderField 
              label={t('diagnosis.step2.usageHours')} 
              value={data.usage_hours} 
              onChange={(v: number) => updateData({ usage_hours: v })} 
              min={0} max={24}
              labels={['0h', '24h']}
            />
            <SliderField 
              label={t('diagnosis.step2.purposeless')} 
              value={data.purposeless} 
              onChange={(v: number) => updateData({ purposeless: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step2.distracted')} 
              value={data.distracted} 
              onChange={(v: number) => updateData({ distracted: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step2.restless')} 
              value={data.restless} 
              onChange={(v: number) => updateData({ restless: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 motion-breathe">
            <h3 className="text-xl font-display text-primary mb-6">{t('diagnosis.step3.title')}</h3>
            
            <SliderField 
              label={t('diagnosis.step3.concentration')} 
              value={data.concentration} 
              onChange={(v: number) => updateData({ concentration: v })} 
              labels={[t('diagnosis.concentrationScale.1'), t('diagnosis.concentrationScale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step3.focusIssue')} 
              value={data.focus_issue} 
              onChange={(v: number) => updateData({ focus_issue: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step3.comparison')} 
              value={data.comparison} 
              onChange={(v: number) => updateData({ comparison: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step3.comparisonFeelings')} 
              value={data.comparison_feelings} 
              onChange={(v: number) => updateData({ comparison_feelings: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step3.validation')} 
              value={data.validation} 
              onChange={(v: number) => updateData({ validation: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
            <SliderField 
              label={t('diagnosis.step3.interestFluctuation')} 
              value={data.interest_fluctuation} 
              onChange={(v: number) => updateData({ interest_fluctuation: v })} 
              labels={[t('diagnosis.scale.1'), t('diagnosis.scale.5')]}
            />
          </div>
        )}

        {error && (
          <div className="mt-6 text-state-error text-sm text-center">
            {error}
          </div>
        )}

      </div>

      <div className="flex justify-between items-center mt-6 px-2">
        <button 
          onClick={prevStep}
          className={`px-4 py-2 rounded-full border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)] transition-colors ${step === 1 ? 'invisible' : ''}`}
        >
          {t('diagnosis.back', 'Back')}
        </button>

        {step < 3 ? (
          <BreathingButton onClick={nextStep}>
            {t('diagnosis.next', 'Next')}
          </BreathingButton>
        ) : (
          <BreathingButton onClick={handleSubmit} disabled={loading}>
            {loading ? t('diagnosis.loading', 'Analyzing...') : t('diagnosis.analyze', 'Analyze my soil')}
          </BreathingButton>
        )}
      </div>
    </div>
  );
}
