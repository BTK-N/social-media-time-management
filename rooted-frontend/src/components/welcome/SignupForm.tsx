import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnderlineInput } from './UnderlineInput';
import { InlineError } from './InlineError';
import { BreathingButton } from '../motion';
import { useAuthStore } from '../../lib/store';

import { storage } from '../../lib/storage';

export function SignupForm({ onSuccess, onError }: { onSuccess: () => void, onError: () => void }) {
  const { t } = useTranslation();
  // We don't have a register in store, we just call storage.auth.register and then onSuccess
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) {
      setErrorMsg(password.length > 0 && password.length < 6 ? t('welcome.form.error.passwordShort') : t('welcome.form.error.invalidCredentials'));
      onError();
      return;
    }
    
    if (password !== confirm) {
      setErrorMsg(t('welcome.form.error.passwordMismatch'));
      onError();
      return;
    }

    if (!consent) {
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await storage.auth.register(username, password);
      if (res.success) {
        const loginRes = await storage.auth.login(username, password);
        if (loginRes.success && loginRes.user) {
          useAuthStore.getState().login(loginRes.user);
          onSuccess();
        } else {
          setErrorMsg(t('welcome.form.error.invalidCredentials'));
          onError();
        }
      } else {
        setErrorMsg(res.error || t('welcome.form.error.usernameTaken'));
        onError();
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('welcome.form.error.usernameTaken'));
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <UnderlineInput
            type="text"
            placeholder={t('welcome.form.username.placeholder')}
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isLoading}
            aria-label={t('welcome.form.username.placeholder')}
            autoComplete="username"
          />
        </div>
        <div>
          <UnderlineInput
            type="password"
            placeholder={t('welcome.form.password.placeholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            aria-label={t('welcome.form.password.placeholder')}
            autoComplete="new-password"
          />
        </div>
        <div>
          <UnderlineInput
            type="password"
            placeholder={t('welcome.form.confirm.placeholder')}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={isLoading}
            aria-label={t('welcome.form.confirm.placeholder')}
            autoComplete="new-password"
          />
        </div>
        
        <label className="flex items-start gap-3 mt-4 group cursor-pointer">
          <div className="relative flex items-start mt-0.5">
            <input 
              type="checkbox" 
              className="peer sr-only"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              disabled={isLoading}
            />
            <div className="w-4 h-4 border border-border-subtle rounded-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-1 peer-checked:bg-sage-600 peer-checked:border-sage-600 flex items-center justify-center bg-transparent group-hover:border-primary">
              <svg 
                className={`w-3 h-3 text-white ${consent ? 'opacity-100' : 'opacity-0'} transition-opacity`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-sm text-muted group-hover:text-primary transition-colors leading-snug">
            {t('welcome.form.consent')}
          </span>
        </label>
      </div>

      <InlineError message={errorMsg} />

      <div className="pt-2">
        <BreathingButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={!consent}
        >
          {isLoading ? t('welcome.form.signup.loading') : t('welcome.form.signup.submit')}
        </BreathingButton>
      </div>
    </form>
  );
}
