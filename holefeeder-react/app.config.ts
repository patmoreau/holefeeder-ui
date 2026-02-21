import 'dotenv/config';
import { ConfigContext } from '@expo/config';
import { ExpoConfig } from '@expo/config-types';

const environment = process.env.APP_ENV || 'development';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({
  path: `.env.${environment}`,
});

const IS_DEV = process.env.APP_ENV === 'development';
const iosIconFile = IS_DEV ? 'safe_dev.icon' : 'safe.icon';
console.log(`Running in ${environment} mode`);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Holefeeder',
  slug: 'holefeeder',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/safe.png',
  scheme: 'holefeeder',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    icon: `./assets/${iosIconFile}`,
    bundleIdentifier: 'com.drifterapps.holefeeder-react',
    infoPlist: {
      ...config.ios?.infoPlist,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true, // Allows all insecure connections in dev
        NSExceptionDomains: {
          'localtest.me': {
            NSIncludesSubdomains: true,
            NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
          },
        },
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.drifterapps.holefeeder_react',
  },
  web: {
    output: 'static',
    favicon: './assets/images/safe.png',
  },
  plugins: [
    'expo-font',
    'expo-localization',
    'expo-web-browser',
    'expo-quick-actions',
    [
      'expo-router',
      {
        root: './src/app',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          buildReactNativeFromSource: true,
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/safe.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
