const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    process: require.resolve('process/browser'),
    path: require.resolve('path-browserify'),
    fs: false,
    os: require.resolve('os-browserify/browser'),
    vm: require.resolve('vm-browserify'),
  };

  // Add webpack plugins for polyfills
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  /**
   * Add WASM support
   */
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true, // Native async WASM support in Webpack 5
  };

  // Add .wasm to resolved extensions
  config.resolve.extensions.push('.wasm');

  const wasmExtensionRegExp = /\.wasm$/;
  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.type === 'asset/resource') {
        oneOf.exclude = oneOf.exclude || [];
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  return config;
} 