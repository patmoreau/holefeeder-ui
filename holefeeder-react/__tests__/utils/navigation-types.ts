// __tests__/utils/navigation-types.ts
import type { NavigationContainer } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define your root stack param list (should match your actual app)
export type RootStackParamList = {
  '(tabs)': undefined;
  '+not-found': undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

// Helper type for testing navigation props
export type MockNavigationProp<T extends keyof RootStackParamList> = {
  navigate: jest.MockedFunction<
    (screen: keyof RootStackParamList, params?: any) => void
  >;
  goBack: jest.MockedFunction<() => void>;
  // Add other navigation methods you use
};
