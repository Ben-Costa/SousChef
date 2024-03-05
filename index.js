import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from './server/databaseConnector/mongoConnector/mongoConnector.js';

const dbURL = process.env.DATABASE_URL;
const credentials = process.env.CREDENTIALS;

const db_connector = mongoDBConnector(dbURL, credentials, dbName)
