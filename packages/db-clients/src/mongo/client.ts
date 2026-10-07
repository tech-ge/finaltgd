import { MongoClient, type Db } from 'mongodb';

export interface MongoConfig {
  connectionString: string;
  databaseName?: string;
  maxPoolSize?: number;
  serverSelectionTimeoutMs?: number;
}

let client: MongoClient | null = null;
let database: Db | null = null;

export async function createMongoClient(config: MongoConfig): Promise<MongoClient> {
  if (client) {
    return client;
  }
  client = new MongoClient(config.connectionString, {
    maxPoolSize: config.maxPoolSize ?? 20,
    serverSelectionTimeoutMS: config.serverSelectionTimeoutMs ?? 5_000,
  });
  await client.connect();
  database = config.databaseName ? client.db(config.databaseName) : client.db();
  return client;
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error('mongo_client_not_initialized');
  }
  return client;
}

export function getMongoDb(): Db {
  if (!database) {
    throw new Error('mongo_database_not_initialized');
  }
  return database;
}

export async function closeMongoClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

export async function mongoHealthCheck(): Promise<boolean> {
  if (!client) {
    return false;
  }
  try {
    await client.db().admin().ping();
    return true;
  } catch {
    return false;
  }
}
