const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push(
  // Adds support for `.cjs` files
  'cjs'
);

module.exports = config;
