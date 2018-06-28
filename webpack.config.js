const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const path = require('path');

module.exports = {
  entry: './src/frontend/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist', "frontend")
  },
  module: {
      rules: [
          {
              test: /\.html$/,
              use: [
                  'file-loader'
              ]
          },
          {
            test: /\.vue$/,
            use: [
                'vue-loader'
            ]
        }
      ]
  }, 
  plugins: [
        new CopyWebpackPlugin([
            { from: './src/frontend/static' }
        ]),
        new VueLoaderPlugin()
    ]
};
