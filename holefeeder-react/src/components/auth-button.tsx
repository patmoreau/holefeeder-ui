import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme, useLanguage } from '@/contexts';
import { combineStyles, createStyles } from '@/utils';
import { useAuth0 } from 'react-native-auth0';
import { Colors } from '@/constants';
import { auth0Config } from '@/config';

export const AuthButton: React.FC = () => {
  const { authorize, clearSession, user, getCredentials, isLoading } =
    useAuth0();
  const { currentLanguage, t } = useLanguage();
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

  const onLogin = async () => {
    await authorize({
      scope: auth0Config.scope,
      audience: auth0Config.audience,
      redirectUrl: auth0Config.redirectUri,
      additionalParameters: {
        ui_locales: currentLanguage,
      },
    });
  };

  const onLogout = async () => {
    await clearSession(
      {
        returnToUrl: auth0Config.logoutRedirectUri,
      },
      {}
    );
  };

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
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {user.name || user.email}!
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.signInText}>Please sign in to continue</Text>
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.buttonText}>Login with Auth0</Text>
      </TouchableOpacity>
    </View>
  );
};
