import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import getUserId from '../utils/getUserId';

// It's largely unnecessary to make your own checks for things such as whether or not a resource actually exists because Prisma can do it for you.
// You should do it though if you want more control over what your error messages say!

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8)
      throw Error('Password must contain at least 8 characters.');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await prisma.mutation.createUser({
      data: { ...data, password: hashedPassword }
    });

    const token = jwt.sign(
      { userId: user.id },
      'h2v3owtpdgCZSQ7HWkCWbGF89VukYdPP',
      { expiresIn: 2400 }
    );

    return { user, token };
  },
  async loginUser(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });
    if (!user) throw Error('Account does not exist.');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw Error('Incorrect password.');

    const token = jwt.sign(
      { userId: user.id },
      'h2v3owtpdgCZSQ7HWkCWbGF89VukYdPP',
      { expiresIn: 2400 }
    );

    return { token, user };
  },
  updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createPost(parent, { data }, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: userId } } } },
      info
    );
  },
  updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  createComment(parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: { connect: { id: data.author } },
          post: { connect: { id: data.post } }
        }
      },
      info
    );
  },
  updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};

export default Mutation;
