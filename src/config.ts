import * as dotenv from 'dotenv';

dotenv.config()

const config = {
  DB_URI: process.env.DB_URI,
  PORT: parseInt(process.env.PORT) | 1337
}

export default config;