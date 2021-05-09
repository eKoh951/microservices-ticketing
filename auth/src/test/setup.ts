import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// Augmented definition
declare global {
  namespace NodeJS {
    interface Global {
      // Global will have a signin function that resolves in a promise that returns an array of strings
      signin(): Promise<string[]>;
    }
  }
}

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

// Global function
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
