/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface MongoClientCache {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

// Declare types for global variables
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var mongoClient: MongoClientCache | undefined;
}

// Mongoose connection cache
const mongooseCache: MongooseCache = (global as any).mongoose || { conn: null, promise: null };
if (!(global as any).mongoose) {
  (global as any).mongoose = mongooseCache;
}

// MongoDB native client cache
const mongoClientCache: MongoClientCache = (global as any).mongoClient || { conn: null, promise: null };
if (!(global as any).mongoClient) {
  (global as any).mongoClient = mongoClientCache;
}

// Connect using Mongoose
export async function connectMongoose() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

// Connect using MongoDB native client
export async function connectMongo() {
  if (mongoClientCache.conn) {
    return mongoClientCache.conn;
  }

  if (!mongoClientCache.promise) {
    mongoClientCache.promise = MongoClient.connect(MONGODB_URI).then((client) => {
      return client;
    });
  }

  try {
    mongoClientCache.conn = await mongoClientCache.promise;
  } catch (e) {
    mongoClientCache.promise = null;
    throw e;
  }

  return mongoClientCache.conn;
}

// Default export for backward compatibility
export default connectMongoose; 