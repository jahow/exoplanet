const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    client: './client/src/index.js',
    server: './server/src/server.js'
  },
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
    filename: '[name]/dist/bundle.js',
    path: path.resolve(__dirname)
  },
  devServer: {
    contentBase: './client/dist'
  }
}
