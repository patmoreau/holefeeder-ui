import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppView } from '@/features/shared/ui/AppView';
import { AuthButton } from '@/features/shared/ui/AuthButton';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { AppText } from '@/features/shared/ui/components/AppText';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { AppIcons } from '@/types/icons';
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
      <View style={{ paddingTop: 16 }}>
        <AppButton
          icon={AppIcons.warning}
          onPress={() => {
            console.log('Test');
            router.push('/test');
          }}
        />
      </View>
    </AppView>
  );
};

export default LoginScreen;
