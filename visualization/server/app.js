import express from 'express'
import path from 'path'
import webpackConfigure from './webpackConfig'

const app = express()
webpackConfigure(app)

app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))

export default app
