import express from 'express'
import _ from 'lodash'
import fs from 'fs'
import { exec } from 'child_process'

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

const replaceAll = (str, search, replacement) => {
  return str.replace(new RegExp(search, 'g'), replacement)
}

apiRouter.post('/lda-predict', (req, res) => {
  const cmd = `python ../process/LDA_predict.py "${replaceAll(req.body, '"', ' ')}"`
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.error('stderr : ' + stderr)
      res.status(400).send('Bad Request')
    } else {
      res.send(stdout)
    }
  })
})

export default apiRouter
