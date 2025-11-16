import { useQuickAction } from 'expo-quick-actions/hooks';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { Auth0Provider } from 'react-native-auth0';
import ErrorBoundary from 'react-native-error-boundary';
import { config } from '@/config/config';
import { AppProvider } from '@/contexts/AppContext';
import { QueryProvider } from '@/contexts/query-provider';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useAuth } from '@/shared/hooks/use-auth';
import { useQuickActions } from '@/shared/hooks/use-quick-actions';

// ===== PRODUCTION LOGGING SETUP =====
if (!__DEV__) {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    originalLog('[PROD-LOG]', new Date().toISOString(), ...args);
  };

  console.error = (...args) => {
    originalError('[PROD-ERROR]', new Date().toISOString(), ...args);
  };

  console.warn = (...args) => {
    originalWarn('[PROD-WARN]', new Date().toISOString(), ...args);
  };

  // Global unhandled error handler
  // if (global.ErrorUtils) {
  //   global.ErrorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
  //     console.error('[UNHANDLED-ERROR]', '\nFatal:', isFatal, '\nName:', error.name, '\nMessage:', error.message, '\nStack:', error.stack);
  //   });
  // }
  // Unhandled promise rejections
  const originalHandler = global.Promise.prototype.catch;
  global.Promise.prototype.catch = function (onRejected) {
    return originalHandler.call(this, (error) => {
      console.error('[UNHANDLED-PROMISE]', error);
      return onRejected ? onRejected(error) : Promise.reject(error);
    });
  };
}

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
  useEffect(() => {
    if (!__DEV__) {
      console.log('[APP-LIFECYCLE] RootLayout mounted');
    }
  }, []);

  useQuickActionRouting();

  const errorHandler = (error: Error, stackTrace: string) => {
    console.error('[ERROR-HANDLER]', error, stackTrace);
  };

  return (
    <ErrorBoundary onError={errorHandler}>
      <Auth0Provider domain={config.auth0.domain} clientId={config.auth0.clientId}>
        <QueryProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </QueryProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
}
