export default function (app) {
  const webpack = require('webpack')
  const config = require('../config/webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const options = {
    noInfo: true,
    publicPath: config.output.publicPath
  }
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, options))
  app.use(webpackHotMiddleware(compiler, options))
}
