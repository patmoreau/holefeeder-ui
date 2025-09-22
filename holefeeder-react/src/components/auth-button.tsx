import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme, useLanguage } from '@/contexts';
import { combineStyles, createStyles } from '@/utils';
import { Colors } from '@/constants';
import { Button } from '@expo/ui/swift-ui';
import { useAuth } from '@/hooks/use-auth';

export const AuthButton: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = createStyles((theme) => ({
    container: combineStyles(theme.styles.containers.center, {
      padding: theme.spacing.lg,
    }),
    loadingText: combineStyles(theme.styles.text.muted, {
      ...theme.typography.callout,
      marginTop: theme.spacing.sm,
    }),
    welcomeText: {
      ...theme.typography.headline,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
      color: theme.colors.label,
    },
    signInText: combineStyles(theme.styles.text.muted, {
      ...theme.typography.callout,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    }),
    loginButton: theme.styles.buttons.primary,
    logoutButton: theme.styles.buttons.danger,
    buttonText: {
      ...theme.typography.headline,
      color: theme.colors.systemBackground,
      textAlign: 'center',
    },
  }))(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.tabIconDefault} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <Button variant="glassProminent" role="destructive" onPress={logout}>
        {t('auth.logoutButton')}
      </Button>
    );
  }

  return (
    <Button variant="glassProminent" onPress={login}>
      {t('auth.loginButton')}
    </Button>
  );
};
