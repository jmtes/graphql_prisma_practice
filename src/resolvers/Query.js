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
    const opArgs = {
      where: {
        published: true
      }
    };

    if (args.query)
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query }
      ];

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
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
  },
  me(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.query.user({ where: { id: userId } }, info);
  },
  myPosts(parent, { query }, { req, prisma }, info) {
    const userId = getUserId(req);

    const opArgs = { where: { author: { id: userId } } };

    if (query)
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];

    return prisma.query.posts(opArgs, info);
  }
};

export default Query;
