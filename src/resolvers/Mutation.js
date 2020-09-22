import bcrypt from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

// It's largely unnecessary to make your own checks for things such as whether or not a resource actually exists because Prisma can do it for you.
// You should do it though if you want more control over what your error messages say!

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.mutation.createUser({
      data: { ...data, password: hashedPassword }
    });

    const token = generateToken(user.id);

    return { user, token };
  },
  async loginUser(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });
    if (!user) throw Error('Account does not exist.');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw Error('Incorrect password.');

    const token = generateToken(user.id);

    return { token, user };
  },
  async updateUser(parent, { data }, { req, prisma }, info) {
    const id = getUserId(req);

    if (data.password) data.password = await hashPassword(data.password);

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  deleteUser(parent, args, { req, prisma }, info) {
    const id = getUserId(req);

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createPost(parent, { data }, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: userId } } } },
      info
    );
  },
  async updatePost(parent, { id, data }, { req, prisma }, info) {
    const userId = getUserId(req);

    const postExists = await prisma.exists.Post({ id, author: { id: userId } });
    if (!postExists) throw Error('Unable to edit post.');

    const postIsPublished = await prisma.exists.Post({ id, published: true });
    if (postIsPublished && data.published === false)
      await prisma.mutation.deleteManyComments({ where: { post: { id } } });

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async deletePost(parent, { id }, { req, prisma }, info) {
    const userId = getUserId(req);

    const postExists = await prisma.exists.Post({ id, author: { id: userId } });
    if (!postExists) throw Error('Unable to delete post.');

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async createComment(parent, { data }, { req, prisma }, info) {
    const userId = getUserId(req);

    const isPublished = await prisma.exists.Post({
      id: data.post,
      published: true
    });
    if (!isPublished) throw Error('Unable to create comment.');

    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: { connect: { id: userId } },
          post: { connect: { id: data.post } }
        }
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { req, prisma }, info) {
    const userId = getUserId(req);

    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });
    if (!commentExists) throw Error('Unable to edit comment.');

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  async deleteComment(parent, { id }, { req, prisma }, info) {
    const userId = getUserId(req);

    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });
    if (!commentExists) throw Error('Unable to delete comment.');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};

export default Mutation;
