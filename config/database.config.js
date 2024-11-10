import { MongoClient } from 'mongodb';
import pkg from 'debug';

const debug = pkg('app:database-config');

const url = process.env.DB_URL || 'mongodb://admin:adminpassword@localhost:27017';
const name = process.env.DB_NAME || 'easybank-database';

let dbInstance = null;

export const connect = async () => {
  if(dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(url);

  try{    
    await client.connect();
    console.log('Connected to the database');
    dbInstance = client.db(name);
    return dbInstance;
  } catch(err) {
    console.error(err);
    debug('Failed to connect to the database');
    process.exit(1);
  }
}

