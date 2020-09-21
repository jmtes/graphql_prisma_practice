import { GraphQLServer, PubSub } from 'graphql-yoga';

import resolvers from './resolvers';
import prisma from './prisma';

// Instantiate PubSub instance
const pubsub = new PubSub();

// Initialize server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({ req, prisma })
});

// Start server
server.start(() => {
  console.log('Server is up!');
});
