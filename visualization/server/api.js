import express from 'express'
import _ from 'lodash'
import fs from 'fs'

const wordsRelationshipPath = '../data/words_relationship.json'
const ldaTopicPath = '../data/lda/topic.json'
const ldaDocInfoPath = '../data/lda/doc.json'

const wordsRelationship = JSON.parse(fs.readFileSync(wordsRelationshipPath))
const ldaDocInfo = JSON.parse(fs.readFileSync(ldaDocInfoPath))
const ldaTopic = JSON.parse(fs.readFileSync(ldaTopicPath))

const apiRouter = express.Router()

apiRouter.get('/words-relationship', (req, res) => {
  const limit = req.query['limit']
  res.json(_.slice(wordsRelationship, 0, limit))
})

apiRouter.get('/lda', (req, res) => {
  const limit = req.query['limit']
  res.json(_.slice(wordsRelationship, 0, limit))
})

apiRouter.get('/lda-topic', (req, res) => {
  res.json(ldaTopic)
})

apiRouter.get('/lda-doc', (req, res) => {
  res.json(ldaDocInfo)
})

apiRouter.post('/lda-predict', (req, res) => {
  console.log(req)
  console.log(req.body)
  res.send(req.body)
})

export default apiRouter
