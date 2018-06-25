const path = require('path');

module.exports = {
  entry: './src/frontend/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
