import { Host, Button } from '@expo/ui/swift-ui';
import React from 'react';
import { View, Text } from 'react-native';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useStyles, useViewStyles } from '@/hooks/theme/use-styles';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { getColor, getThemedTypography } from '@/utils/style-utils';

export const AuthButton: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const containerStyles = useViewStyles();

  const styles = useStyles((theme, global) => ({
    container: {
      ...global.center,
      ...global.p20,
    },
    loadingText: {
      ...getThemedTypography(theme, 'callout', 'secondaryLabel'),
      ...global.mt8,
      ...global.textCenter,
    },
    welcomeText: {
      ...getThemedTypography(theme, 'headline', 'label'),
      ...global.mb20,
      ...global.textCenter,
    },
    signInText: {
      ...getThemedTypography(theme, 'callout', 'secondaryLabel'),
      ...global.mb20,
      ...global.textCenter,
    },
  }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator size="large" />
        <Text style={styles.loadingText}>{t('auth.loading')}</Text>
      </View>
    );
  }

  if (user) {
    return (
      <Host style={containerStyles.host}>
        <Button variant="glassProminent" role="destructive" onPress={logout}>
          {t('auth.logoutButton')}
        </Button>
      </Host>
    );
  }

  return (
    <Host style={containerStyles.host}>
      <Button variant="glassProminent" onPress={login}>
        {t('auth.loginButton')}
      </Button>
    </Host>
  );
};
