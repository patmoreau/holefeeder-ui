import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
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
      <ThemedView style={styles.centered}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.centered}>
      <ThemedText variant={'title'}>{t(tk.auth.loginTitle)}</ThemedText>
      <ThemedText variant={'subtitle'}>{t(tk.auth.loginSubtitle)}</ThemedText>
      <AuthButton />
    </ThemedView>
  );
};

export default LoginScreen;
