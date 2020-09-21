import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'wAQfFMm8RGVpXh9HCjnVX15dpBF9iJCe'
});

export default prisma;
