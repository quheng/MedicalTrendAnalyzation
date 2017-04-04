import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

import webpackConfigure from './webpackConfig'
import apiRoute from './api'

const app = express()
webpackConfigure(app)
app.use(bodyParser.json())

app.use('/api', apiRoute)
app.use('/*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')))

export default app
