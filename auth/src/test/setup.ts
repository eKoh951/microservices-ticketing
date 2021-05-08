import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  // Hook function to run before all the tests
  mongo = new MongoMemoryServer(); // Create mongo server
  const mongoUri = await mongo.getUri(); // Get the URL to connect to it

  await mongoose.connect(mongoUri, {
    // Finally, connect to the server
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Hook function to run before each of the tests
  // We will reset all of the data
  const collections = await mongoose.connection.db.collections(); // Get all the collections

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Delete mongo server
  await mongo.stop();
  await mongoose.connection.close();
});
