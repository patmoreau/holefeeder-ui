import { PowerSyncContext } from '@powersync/react';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
// Polyfill required for PowerSync/SQLite to handle async allows (Symbol.asyncIterator) correctly in React Native
import '@azure/core-asynciterator-polyfill';
import { useEffect } from 'react';
import { Auth0Provider } from 'react-native-auth0';
import ErrorBoundary from 'react-native-error-boundary';
import { config } from '@/config/config';
import { AppProvider } from '@/contexts/AppContext';
import { RepositoryProvider } from '@/contexts/RepositoryContext';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useAuth } from '@/shared/hooks/use-auth';
import { useQuickActions } from '@/shared/hooks/use-quick-actions';
import { db } from '@/shared/persistence/db';
import { PowerSyncConnection } from '@/shared/persistence/PowerSyncConnection';

(function addConsoleTimestamp() {
  const methods: (keyof Console)[] = ['log', 'info', 'warn', 'error', 'debug'];
  methods.forEach((m) => {
    const orig = (console as any)[m].bind(console);
    (console as any)[m] = (...args: any[]) => {
      const time = new Date().toISOString();
      orig(`[${time}]`, ...args);
    };
  });
})();

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
  const { theme } = useTheme();

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
      <Stack.Screen
        name="test"
        options={{
          headerTransparent: true,
          headerTintColor: theme.colors.tint,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (!__DEV__) {
      console.log('[APP-LIFECYCLE] RootLayout mounted');
    }
  }, []);

  const errorHandler = (error: Error, stackTrace: string) => {
    console.error('[ERROR-HANDLER]', error, stackTrace);
  };

  return (
    <ErrorBoundary onError={errorHandler}>
      <Auth0Provider domain={config.auth0.domain} clientId={config.auth0.clientId}>
        <AppProvider>
          <PowerSyncContext.Provider value={db}>
            <PowerSyncConnection>
              <RepositoryProvider>
                <AppContent />
              </RepositoryProvider>
            </PowerSyncConnection>
          </PowerSyncContext.Provider>
        </AppProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
}
