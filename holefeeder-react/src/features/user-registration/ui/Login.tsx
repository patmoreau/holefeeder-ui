import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/features/shared/ui/components/AppText';
import { AppView } from '@/features/shared/ui/components/AppView';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { GlobalStyles } from '@/types/theme/global-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme, global: typeof GlobalStyles) => ({
  centered: {
    ...theme.styles.containers.center,
    ...global.gapMedium,
  },
});

const LoginScreen = () => {
  const { isLoading } = useAuth();

  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  if (isLoading) {
    return (
      <AppView style={styles.centered}>
        <LoadingIndicator size="large" />
      </AppView>
    );
  }

  return (
    <AppView style={styles.centered}>
      <AppText variant={'title'}>{t(tk.auth.loginTitle)}</AppText>
      <AppText variant={'subtitle'}>{t(tk.auth.loginSubtitle)}</AppText>
      <AuthButton />
    </AppView>
  );
};

export default LoginScreen;
