import { Host, Button } from '@expo/ui/swift-ui';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLanguage, useStyles, useContainerStyles } from '@/hooks';
import { useAuth } from '@/hooks/use-auth';
import { getColor, getThemedTypography } from '@/utils/style-utils';

export const AuthButton: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const containerStyles = useContainerStyles();

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
    activityIndicator: {
      color: getColor(theme, 'label'),
    },
  }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={styles.activityIndicator.color} />
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
