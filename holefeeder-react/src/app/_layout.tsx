import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks';
import { LanguageProvider, ThemeProvider } from '@/contexts';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import LoginScreen from '@/app/login';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import { auth0Config } from '@/config';
import { useEffect } from 'react';
import * as QuickActions from 'expo-quick-actions';
import { useQuickActionRouting } from 'expo-quick-actions/router';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { user, isLoading } = useAuth0();
  useQuickActionRouting();

  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Wait! Don't delete me!",
        subtitle: "We're here to help",
        icon:
          Platform.OS === 'ios'
            ? 'symbol:person.crop.circle.badge.questionmark'
            : undefined,
        id: '0',
        params: { href: '/help' },
      },
    ]);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Modal' }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ReactNavigationThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <ThemeProvider>
        <LanguageProvider>
          <Auth0Provider
            domain={auth0Config.domain}
            clientId={auth0Config.clientId}
          >
            <AppContent />
            <StatusBar style="auto" />
          </Auth0Provider>
        </LanguageProvider>
      </ThemeProvider>
    </ReactNavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
