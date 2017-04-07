import express from 'express'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'

import { spawn } from 'child_process'

const wordsRelationshipPath = path.join(__dirname, '..', '..', 'data', 'words_relationship.json')
const ldaTopicPath = path.join(__dirname, '..', '..', 'data', 'lda', 'topic.json')
const ldaDocInfoPath = path.join(__dirname, '..', '..', 'data', 'lda', 'doc.json')
const ldaConfigPath = path.join(__dirname, '..', '..', 'process', 'LDA_config.json')

const wordsRelationship = JSON.parse(fs.readFileSync(wordsRelationshipPath))

const apiRouter = express.Router()

apiRouter.get('/words-relationship/:limit', (req, res) => {
  res.json(_.slice(wordsRelationship, 0, req.params.limit))
})

apiRouter.get('/lda-topic', (req, res) => {
  res.sendFile(ldaTopicPath)
})

apiRouter.get('/lda-doc', (req, res) => {
  res.sendFile(ldaDocInfoPath)
})

const uint8ArrayToString = (data) => {
  return String.fromCharCode.apply(null, data)
}

apiRouter.post('/lda-predict', (req, res) => {
  const process = spawn('python', ['../process/LDA_predict.py', ...req.body])
  process.stdout.on('data', function (data) {
    res.send(uint8ArrayToString(data))
  })
})

apiRouter.post('/lda-config', (req, res) => {
  const process = spawn('python', ['../process/LDA.py', JSON.stringify(req.body)])
  process.stdout.on('data', function (data) {
    res.json({
      config: uint8ArrayToString(data),
      keywords: JSON.parse(fs.readFileSync(ldaTopicPath))
    })
  })
})

apiRouter.get('/lda-config', (req, res) => {
  res.json({
    config: JSON.parse(fs.readFileSync(ldaConfigPath)),
    keywords: JSON.parse(fs.readFileSync(ldaTopicPath))
  })
})

export default apiRouter
