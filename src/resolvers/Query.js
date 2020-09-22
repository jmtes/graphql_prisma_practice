import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query)
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      };

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query)
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me() {
    return {
      id: '062e98c1-ea91-4369-b52a-634b80126027',
      name: 'Juno',
      email: 'juno@domain.tld',
      age: 20
    };
  },
  async post(parent, { id }, { req, prisma }, info) {
    const userId = getUserId(req, false);

    const [post] = await prisma.query.posts(
      {
        where: {
          id,
          OR: [{ published: true }, { author: { id: userId } }]
        }
      },
      info
    );
    if (!post) throw Error('Unable to find post.');

    return post;
  }
};

export default Query;
