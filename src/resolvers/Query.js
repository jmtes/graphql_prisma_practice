import getUserId from '../utils/getUserId';

const Query = {
  users(parent, { query, first, skip, after }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after
    };

    if (query) opArgs.where = { name_contains: query };

    return prisma.query.users(opArgs, info);
  },
  posts(parent, { query, first, skip, after }, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      },
      first,
      skip,
      after
    };

    if (query)
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, { first, skip, after }, { prisma }, info) {
    return prisma.query.comments({ first, skip, after }, info);
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
  myPosts(parent, { query, first, skip, after }, { req, prisma }, info) {
    const userId = getUserId(req);

    const opArgs = { where: { author: { id: userId } }, first, skip, after };

    if (query)
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];

    return prisma.query.posts(opArgs, info);
  }
};

export default Query;
