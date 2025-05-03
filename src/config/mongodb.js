import mongoose from 'mongoose'
import { env } from './environment'

const connectString = env.MONGODB_URI

class Database {
  constructor() {}

  async connect() {
    try {
      await mongoose.connect(connectString, {
        maxPoolSize: 50,
        dbName: env.DATABASE_NAME
      })
    } catch (err) {
      throw err
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

export const instanceMongodb = Database.getInstance()
