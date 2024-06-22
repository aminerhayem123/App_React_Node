// webpack.config.js

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  // other webpack configurations
  plugins: [
    new ReactRefreshWebpackPlugin(),
    // other plugins
  ],
  // other webpack configurations
};
