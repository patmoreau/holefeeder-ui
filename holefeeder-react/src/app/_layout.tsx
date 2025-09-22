import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAuth, useColorScheme, useQuickActions } from '@/hooks';
import { AppProvider, LanguageProvider, ThemeProvider } from '@/contexts';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import { auth0Config } from '@/config';
import { useQuickActionRouting } from 'expo-quick-actions/router';

function AppContent() {
  const { user, isLoading } = useAuth();

  useQuickActionRouting();
  useQuickActions();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Auth0Provider domain={auth0Config.domain} clientId={auth0Config.clientId}>
      <AppProvider>
        <LanguageProvider>
          <ReactNavigationThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <ThemeProvider>
              <AppContent />
              <StatusBar style="auto" />
            </ThemeProvider>
          </ReactNavigationThemeProvider>
        </LanguageProvider>
      </AppProvider>
    </Auth0Provider>
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
