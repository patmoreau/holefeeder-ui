import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useAuth, useContainerStyles, useQuickActions } from '@/hooks';
import { AppProvider } from '@/contexts';
import { View } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import { config } from '@/config';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import { LoadingIndicator } from '@/components';

function AppContent() {
  const { user, isLoading } = useAuth();
  const containerStyles = useContainerStyles();

  useQuickActionRouting();
  useQuickActions();

  if (isLoading) {
    return (
      <View style={containerStyles.centered}>
        <LoadingIndicator size="large" />
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
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
    >
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Auth0Provider>
  );
}
