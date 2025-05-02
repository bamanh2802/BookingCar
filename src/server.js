import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { API_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const START_SERSER = () => {
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

  exitHook(() => {
    CLOSE_DB()
  })
}

;(async () => {
  try {
    console.log('1. Connecting to MongoDD Cloud Atlas!')
    await CONNECT_DB()
    console.log('2. Connected to MongoDD Cloud Atlas!')
    START_SERSER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
