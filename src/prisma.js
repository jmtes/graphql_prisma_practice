import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const logData = (data) => console.log(JSON.stringify(data, undefined, 2));
const logErr = (err) => console.log(err);

prisma.query
  .users(null, '{ id name posts { title } }')
  .then(logData)
  .catch(logErr);

prisma.query
  .comments(null, '{ id text author { id name } }')
  .then(logData)
  .catch(logErr);
