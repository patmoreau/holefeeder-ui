/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@expo/ui/swift-ui', () => {
  const React = require('react');
  const { View, Text: RNText, Button: RNButton } = require('react-native');

  return {
    Host: ({ children, style }: { children: unknown; style: unknown }) => React.createElement(View, { testID: 'host', style }, children),
    BottomSheet: ({ children, isOpened }: { children: unknown; isOpened: unknown }) =>
      isOpened ? React.createElement(View, { testID: 'bottom-sheet' }, children) : null,
    VStack: ({ children }: { children: unknown }) => React.createElement(View, { testID: 'vstack' }, children),
    HStack: ({ children }: { children: unknown }) => React.createElement(View, { testID: 'hstack', style: { flexDirection: 'row' } }, children),
    Text: ({ children }: { children: unknown; style: unknown }) => React.createElement(RNText, null, children),
    Button: ({ children, onPress }: { children: unknown; onPress: unknown }) =>
      React.createElement(RNButton, {
        title: typeof children === 'string' ? children : 'Button',
        onPress,
      }),
    Image: ({ systemName }: { systemName: unknown }) => React.createElement(View, { testID: `image-${systemName}` }),
  };
});

jest.mock('@expo/ui/swift-ui/modifiers', () => ({
  frame: jest.fn((props) => props),
  padding: jest.fn((props) => props),
}));

jest.mock('react-native-auth0', () => ({
  useAuth0: jest.fn(),
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock structuredClone global function
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
