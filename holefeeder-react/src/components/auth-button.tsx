import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
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
    button: {
      backgroundColor: getColor(theme, 'systemBackground'),
      borderRadius: 8,
      padding: 12,
      minWidth: 120,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: getColor(theme, 'separator'),
    },
    buttonText: {
      ...getThemedTypography(theme, 'body', 'label'),
    },
    destructiveButton: {
      backgroundColor: getColor(theme, 'systemRed'),
    },
    destructiveText: {
      color: getColor(theme, 'systemBackground'),
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
      <View style={containerStyles.primary}>
        <Pressable style={[styles.button, styles.destructiveButton]} onPress={logout}>
          <Text style={[styles.buttonText, styles.destructiveText]}>{t('auth.logoutButton')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={containerStyles.primary}>
      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>{t('auth.loginButton')}</Text>
      </Pressable>
    </View>
  );
};
