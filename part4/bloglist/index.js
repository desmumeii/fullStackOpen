const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path)
  next()
})
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})