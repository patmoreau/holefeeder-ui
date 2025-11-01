import { useQuickAction } from 'expo-quick-actions/hooks';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Auth0Provider } from 'react-native-auth0';
import { config } from '@/config/config';
import { AppProvider } from '@/contexts/AppContext';
import { QueryProvider } from '@/contexts/query-provider';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useAuth } from '@/shared/hooks/use-auth';
import { useQuickActions } from '@/shared/hooks/use-quick-actions';

function AppContent() {
  const { user, isLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const action = useQuickAction();

  useQuickActionRouting();
  useQuickActions();

  if (isLoading) {
    return <LoadingIndicator size="large" />;
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
  useQuickActionRouting();

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
