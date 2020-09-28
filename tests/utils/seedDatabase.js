import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';

export const userOne = {
  input: {
    name: 'Emma Thomas',
    email: 'emma@domain.tld',
    password: bcrypt.hashSync('LFdx1ZZnXju6')
  },
  user: null,
  jwt: null
};

export const userTwo = {
  input: {
    name: 'Parvana Khan',
    email: 'parvana@domain.tld',
    password: bcrypt.hashSync('LFdx1ZZnXju6')
  },
  user: null,
  jwt: null
};

export const postOne = {
  input: { title: 'A Published Post', body: 'We are live!', published: true },
  post: null
};

export const postTwo = {
  input: { title: 'A Draft Post', body: 'Not finished yet!', published: false },
  post: null
};

export const commentOne = {
  input: { text: 'Test Comment 1' },
  comment: null
};

export const commentTwo = {
  input: { text: 'Test Comment 2' },
  comment: null
};

const seedDatabase = async () => {
  // Wipe database
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create dummy users
  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  // Create dummy posts
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: { connect: { id: userOne.user.id } }
    }
  });
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: { connect: { id: userOne.user.id } }
    }
  });

  // Create dummy comments
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: { connect: { id: userTwo.user.id } },
      post: { connect: { id: postOne.post.id } }
    }
  });
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: { connect: { id: userOne.user.id } },
      post: { connect: { id: postOne.post.id } }
    }
  });
};

export default seedDatabase;
