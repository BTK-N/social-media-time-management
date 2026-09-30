import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnderlineInput } from './UnderlineInput';
import { InlineError } from './InlineError';
import { BreathingButton } from '../motion';
import { useAuthStore } from '../../lib/store';

import { storage } from '../../lib/storage';

export function LoginForm({ onSuccess, onError }: { onSuccess: () => void, onError: () => void }) {
  const { t } = useTranslation();
  const login = useAuthStore(s => s.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) {
      setErrorMsg(password.length > 0 && password.length < 6 ? t('welcome.form.error.passwordShort') : t('welcome.form.error.invalidCredentials'));
      onError();
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await storage.auth.login(username, password);
      if (res.success && res.user) {
        login(res.user);
        onSuccess();
      } else {
        setErrorMsg(res.error || t('welcome.form.error.invalidCredentials'));
        onError();
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('welcome.form.error.invalidCredentials'));
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
            autoComplete="current-password"
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-xs text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
              title={t('welcome.form.forgotTooltip')}
              onClick={(e) => {
                e.preventDefault();
                alert(t('welcome.form.forgotTooltip'));
              }}
            >
              {t('welcome.form.forgot')}
            </button>
          </div>
        </div>
      </div>

      <InlineError message={errorMsg} />

      <div className="pt-2">
        <BreathingButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          {isLoading ? t('welcome.form.login.loading') : t('welcome.form.login.submit')}
        </BreathingButton>
      </div>
    </form>
  );
}
