import 'dotenv/config';

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
      'expo-router',
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
      // [
      //   'react-native-auth0',
      //   {
      //     domain:
      //       process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-domain.auth0.com',
      //     customScheme: 'holefeeder',
      //   },
      // ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
