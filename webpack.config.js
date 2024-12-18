const path = require("path");
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = {
 
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync('src/**/*', { nodir: true }),
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[path][base].gz',
    }),
  ],
};
