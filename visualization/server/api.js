import express from 'express'
import _ from 'lodash'
import fs from 'fs'
import { spawn } from 'child_process'

const wordsRelationshipPath = '../data/words_relationship.json'
const ldaTopicPath = '../data/lda/topic.json'
const ldaDocInfoPath = '../data/lda/doc.json'

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

export default apiRouter
