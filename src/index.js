import '@babel/polyfill';

import { GraphQLServer, PubSub } from 'graphql-yoga';

import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';

// Instantiate PubSub instance
const pubsub = new PubSub();

// Initialize server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({ req, prisma }),
  fragmentReplacements
});

// Start server
server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('Server is up!');
});
