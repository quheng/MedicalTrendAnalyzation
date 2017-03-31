import path from 'path'
import express from 'express'
import morgan from 'morgan'
import webpack from 'webpack'
import config from './webpackConfig'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import DashboardPlugin from 'webpack-dashboard/plugin'
const ROOT = __dirname

const app = express()

const compiler = webpack(config)
compiler.apply(new DashboardPlugin())
const options = {
  noInfo: true,
  publicPath: config.output.publicPath
}
app.use(webpackDevMiddleware(compiler, options))
app.use(webpackHotMiddleware(compiler, options))

app.use(morgan('dev'))
app.use('/static', express.static(path.join(ROOT, 'static')))
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'))
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 4000

app.listen(port, host, err => {
  if (err) {
    console.error(err)
    return
  }
  console.info(`listening at ${host}:${port}`)
})
