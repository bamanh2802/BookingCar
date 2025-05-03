import express from 'express'
import { env } from '~/config/environment'
import { instanceMongodb } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { API_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const START_SERVER = () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(errorHandlingMiddleware)
  app.use(cookieParser())
  app.use('/v1', API_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. App listening at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })
}

;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas!')
    await instanceMongodb.connect()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error('❌ Failed to start server due to MongoDB connection error:')
    console.error(error)
    process.exit(1)
  }
})()
