// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/** @type {import('metro-config').GetTransformOptions} */
const getTransformOptions = async (_entryPoints, _options, _getDependenciesOf) => ({
  transform: {
    inlineRequires: {
      blockList: {
        [require.resolve('@powersync/react-native')]: true,
      },
    },
  },
});

config.transformer.getTransformOptions = getTransformOptions;

module.exports = config;
