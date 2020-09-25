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
  await prisma.mutation.createPost({
    data: {
      title: 'A Published Post',
      body: 'We are live!',
      published: true,
      author: { connect: { id: userOne.user.id } }
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: 'A Draft Post',
      body: 'Not finished yet!',
      published: false,
      author: { connect: { id: userOne.user.id } }
    }
  });
};

export default seedDatabase;
