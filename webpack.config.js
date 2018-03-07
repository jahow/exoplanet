const path = require('path')
const fs = require('fs')

// set node modules as commonjs externals
// see: https://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = [{
  mode: 'development',
  devtool: 'source-map',
  entry: './client/src/index.js',
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: path.resolve(__dirname, 'client', 'src'),
        test: /\.js?$/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist')
  },
  devServer: {
    contentBase: './client/dist'
  }
}, {
  mode: 'development',
  target: 'node',
  devtool: 'source-map',
  entry: './server/src/server.js',
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: [
          path.resolve(__dirname, 'client', 'src'),
          path.resolve(__dirname, 'server', 'src')
        ],
        test: /\.js?$/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'server', 'dist')
  },
  externals: nodeModules,
  node: {
    __dirname: false
  }
}]