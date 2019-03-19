import * as dotenv from 'dotenv';

dotenv.config()

const config = {
  DB_URI: process.env.DB_URI,
  PORT: parseInt(process.env.PORT) | 1337,
  DB_DEBUG_OPTION: process.env.DB_DEBUG_OPTION
}

export default config;