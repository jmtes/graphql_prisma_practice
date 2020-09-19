import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const logData = (data) => console.log(JSON.stringify(data, undefined, 2));
const logErr = (err) => console.log(err);

prisma.mutation
  .updatePost({
    where: {
      id: 'ckfa9l9hg00610884tcw41fd8'
    },
    data: {
      body: 'why wont anyone ask me out!!! im so lonely!!!',
      published: true
    }
  })
  .then(() =>
    prisma.query.posts(null, '{ id title body published author { name } }')
  )
  .then(logData)
  .catch(logErr);
