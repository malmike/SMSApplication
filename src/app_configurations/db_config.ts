import * as mongoose from 'mongoose';
import config from './config';

export default class DBConfig{
  private connString = config.DB_URI;

  async dbConnection(){
    try{
      const db = await mongoose.connect(this.connString);
      mongoose.set('debug', config.DB_DEBUG_OPTION)
    }
    catch(error){
      throw(`Could not connect to mongo DB: ${error}`);
    }
  }
}

