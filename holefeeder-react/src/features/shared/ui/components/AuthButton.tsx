import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { tk } from '@/i18n/translations';
import { useAuth } from '@/shared/hooks/use-auth';

export const AuthButton = () => {
  const { user, login, logout } = useAuth();
  const { t } = useTranslation();

  if (user) {
    return <AppButton label={t(tk.auth.logoutButton)} variant="destructive" onPress={logout} />;
  }

  return <AppButton label={t(tk.auth.loginButton)} variant="primary" onPress={login} />;
};
