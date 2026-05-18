const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force Metro to map react, react-native, and react-navigation strictly to the local node_modules
// to ensure only a single React instance is bundled and preventing any context sharing issues.
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
  "@react-navigation/native": path.resolve(__dirname, "node_modules/@react-navigation/native"),
  "@react-navigation/bottom-tabs": path.resolve(__dirname, "node_modules/@react-navigation/bottom-tabs"),
  "@react-navigation/native-stack": path.resolve(__dirname, "node_modules/@react-navigation/native-stack"),
  "react-native-safe-area-context": path.resolve(__dirname, "node_modules/react-native-safe-area-context"),
  "react-native-screens": path.resolve(__dirname, "node_modules/react-native-screens"),
};

module.exports = withNativeWind(config, { input: "./global.css" });

