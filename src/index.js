import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import resolvers from './resolvers';

import './prisma';

// Instantiate PubSub instance
const pubsub = new PubSub();

// Initialize server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db, pubsub }
});

// Start server
server.start(() => {
  console.log('Server is up!');
});
