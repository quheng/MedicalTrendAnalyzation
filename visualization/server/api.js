import express from 'express'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'

import { spawn } from 'child_process'

const wordsRelationshipPath = path.join(__dirname, '..', '..', 'data', 'words_relationship.json')
const ldaTopicPath = path.join(__dirname, '..', '..', 'data', 'lda', 'topic.json')
const ldaDocInfoPath = path.join(__dirname, '..', '..', 'data', 'lda', 'doc.json')
const ldaConfigPath = path.join(__dirname, '..', '..', 'process', 'LDA_config.json')
const ldaTopicAmountPath = path.join(__dirname, '..', '..', 'data', 'lda', 'lda.json')

const totTopicPath = path.join(__dirname, '..', '..', 'data', 'tot', 'topic.json')
const totTopicAmountPath = path.join(__dirname, '..', '..', 'data', 'tot', 'tot.json')

const wordsRelationship = JSON.parse(fs.readFileSync(wordsRelationshipPath))

const apiRouter = express.Router()

apiRouter.get('/words-relationship/:limit', (req, res) => {
  res.json(_.slice(wordsRelationship, 0, req.params.limit))
})

apiRouter.get('/lda-topic', (req, res) => {
  res.sendFile(ldaTopicPath)
})

// fixed by config max-idf 0.79 min-idf 0.19 words 6 max-iter 5 topic-amount 9
apiRouter.get('/lda-topic-amount', (req, res) => {
  res.sendFile(ldaTopicAmountPath)
})

apiRouter.get('/lda-doc', (req, res) => {
  res.sendFile(ldaDocInfoPath)
})

apiRouter.post('/lda-predict', (req, res) => {
  const process = spawn('python', ['../process/LDA_predict.py', ...req.body])
  process.stdout.on('data', function (data) {
    res.send(data.toString())
  })
})

apiRouter.post('/lda-config', (req, res) => {
  const process = spawn('python', ['../process/LDA.py', JSON.stringify(req.body)])
  process.stdout.on('data', function (data) {
    res.send(data.toString())
  })
})

apiRouter.get('/lda-config', (req, res) => {
  res.sendFile(ldaConfigPath)
})

apiRouter.get('/tot-topic', (req, res) => {
  res.sendFile(totTopicPath)
})

apiRouter.get('/tot-topic-amount', (req, res) => {
  res.sendFile(totTopicAmountPath)
})

export default apiRouter
