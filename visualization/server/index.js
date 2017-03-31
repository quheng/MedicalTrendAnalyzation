import app from './app'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 2222

app.listen(port, host, (err) => {
  if (err) {
    console.error('failed to start up hatu', err)
    process.exit(-1)
  }
  console.info(`hatu listening at ${host}:${port}`)
})
