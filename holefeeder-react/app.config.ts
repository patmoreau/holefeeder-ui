import 'dotenv/config';

const environment = process.env.APP_ENV || 'development';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({
  path: `.env.${environment}`,
});

export default {
  expo: {
    name: 'Holefeeder',
    slug: 'holefeeder',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'holefeeder',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      icon: './assets/safe.icon',
      bundleIdentifier: 'com.drifterapps.holefeeder-react',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.drifterapps.holefeeder_react',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-font',
      'expo-localization',
      'expo-web-browser',
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
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
