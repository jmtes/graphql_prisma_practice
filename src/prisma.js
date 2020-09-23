import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './resolvers';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'wAQfFMm8RGVpXh9HCjnVX15dpBF9iJCe',
  fragmentReplacements
});

export default prisma;
