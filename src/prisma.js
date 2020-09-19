import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const logData = (data) => console.log(JSON.stringify(data, undefined, 2));
const logErr = (err) => console.log(err);

const createPostForUser = async (userId, data) => {
  await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: userId
        }
      }
    }
  });

  const user = await prisma.query.user(
    {
      where: {
        id: userId
      }
    },
    '{ id name email posts { id title published } }'
  );

  return user;
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id } }'
  );

  const { id } = post.author;

  const user = await prisma.query.user(
    {
      where: {
        id
      }
    },
    '{ id name email posts { id title published } }'
  );

  return user;
};

updatePostForUser('ckfaag2la008e0884ok0rdgjr', { published: true }).then(
  logData
);

createPostForUser('ckf8mz6jj008h0884q6tyw2v6', {
  title: 'cuffed jeans are the mark of bisexuality',
  body: 'i dont make the rules',
  published: false
}).then(logData);
