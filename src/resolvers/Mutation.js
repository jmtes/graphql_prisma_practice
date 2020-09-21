import bcrypt from 'bcryptjs';

// It's largely unnecessary to make your own checks for things such as whether or not a resource actually exists because Prisma can do it for you.
// You should do it though if you want more control over what your error messages say!

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8)
      throw Error('Password must contain at least 8 characters.');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return prisma.mutation.createUser(
      { data: { ...data, password: hashedPassword } },
      info
    );
  },
  updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createPost(parent, { data }, { prisma }, info) {
    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: data.author } } } },
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
