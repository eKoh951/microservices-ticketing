import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Augmented definition
declare global {
  namespace NodeJS {
    interface Global {
      // Global will have a signin function that resolves in a promise that returns an array of strings
      signin(id?: string): string[];
    }
  }
}

// Mock the nats-wrapper implementation
jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY =
  'sk_test_51IOsvWL7zBVU68pHJQGQoBmbL1YCuvRr0J22XvSDuUbARK8uccKLsNygCtxp6d3y32s2DPNQCyrKFH257W8aNiKo00NnTQGkqq';

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
  // Cleans all the mock things (like functions) to not pollute a test results
  // to other test
  jest.clearAllMocks();

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
global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that is the cookie with the encoded data
  return [`express:sess=${base64}`];
};
