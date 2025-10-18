import { useQuickActionRouting } from 'expo-quick-actions/router';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { View } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import { LoadingIndicator } from '@/components';
import { config } from '@/config';
import { AppProvider } from '@/contexts';
import { QueryProvider } from '@/contexts/query-provider';
import { useViewStyles } from '@/hooks/theme/use-styles';
import { useAuth } from '@/hooks/use-auth';
import { useQuickActions } from '@/hooks/use-quick-actions';

function AppContent() {
  const { user, isLoading } = useAuth();
  const containerStyles = useViewStyles();

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
    <Auth0Provider domain={config.auth0.domain} clientId={config.auth0.clientId}>
      <QueryProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </QueryProvider>
    </Auth0Provider>
  );
}
