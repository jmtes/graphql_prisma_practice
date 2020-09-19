import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const logData = (data) => console.log(JSON.stringify(data, undefined, 2));
const logErr = (err) => console.log(err.message);

const createPostForUser = async (userId, data) => {
  // Make sure user exists
  const userExists = await prisma.exists.User({ id: userId });
  if (!userExists) throw Error('User does not exist.');

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: userId
          }
        }
      }
    },
    '{ author { id name email posts { id title published } } }'
  );

  return post.author;
};

const updatePostForUser = async (postId, data) => {
  // Check if post exists
  const postExists = await prisma.exists.Post({ id: postId });
  if (!postExists) throw Error('Post does not exist.');

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id name email posts { id title published } } }'
  );

  return post.author;
};

// Check if user with given ID has a post with the given title
// prisma.exists
//   .User({
//     id: 'ckf8mz6jj008h0884q6tyw2v6',
//     posts_some: {
//       title: 'just gave myself a bad dye job'
//     }
//   })
//   .then(logData);

createPostForUser('ckf8mz6jj008h0884q6tyw2v', {
  title: 'i got a crush on u.....',
  body: '',
  published: false
})
  .then(logData)
  .catch(logErr);

updatePostForUser('ckfaag2la008e0884ok0rdgj', { published: false })
  .then(logData)
  .catch(logErr);
