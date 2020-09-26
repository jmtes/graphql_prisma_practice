import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';

export const userOne = {
  input: {
    name: 'Emma Thomas',
    email: 'emma@domain.tld',
    password: bcrypt.hashSync('QhzuCsao')
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

const seedDatabase = async () => {
  // Wipe database
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create dummy user
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

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
};

export default seedDatabase;
