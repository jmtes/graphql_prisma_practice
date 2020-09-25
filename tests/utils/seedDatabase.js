import bcrypt from 'bcryptjs';

import prisma from '../../src/prisma';

const seedDatabase = async () => {
  // Wipe database
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create dummy user
  const user = await prisma.mutation.createUser({
    data: {
      name: 'Emma Thomas',
      email: 'emma@domain.tld',
      password: bcrypt.hashSync('QhzuCsao')
    }
  });

  // Create dummy posts
  await prisma.mutation.createPost({
    data: {
      title: 'A Published Post',
      body: 'We are live!',
      published: true,
      author: { connect: { id: user.id } }
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: 'A Draft Post',
      body: 'Not finished yet!',
      published: false,
      author: { connect: { id: user.id } }
    }
  });
};

export default seedDatabase;
