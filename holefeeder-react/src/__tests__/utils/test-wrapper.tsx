import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

export interface TestWrapperProps {
  children: ReactNode;
  initialRouteName?: string;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  initialRouteName,
}) => {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 320, height: 640 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <NavigationContainer>{children}</NavigationContainer>
    </SafeAreaProvider>
  );
};
