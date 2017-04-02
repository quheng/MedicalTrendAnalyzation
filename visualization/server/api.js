import express from 'express'
import _ from 'lodash'
import fs from 'fs'

const wordsRelationshipPath = '../data/words_relationship.json'

const wordsRelationship = JSON.parse(fs.readFileSync(wordsRelationshipPath))

const apiRouter = express.Router()

apiRouter.get('/words-relationship', (req, res) => {
  const limit = req.query['limit']
  res.json(_.slice(wordsRelationship, 0, limit))
})

apiRouter.get('/lda', (req, res) => {
  const limit = req.query['limit']
  res.json(_.slice(wordsRelationship, 0, limit))
})

export default apiRouter
