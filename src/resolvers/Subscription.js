import getUserId from '../utils/getUserId';

const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        postId ? { where: { node: { post: { id: postId } } } } : null,
        info
      );
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(
        { where: { node: { published: true } } },
        info
      );
    }
  },
  myPost: {
    subscribe(parent, args, { req, prisma }, info) {
      const userId = getUserId(req);

      return prisma.subscription.post(
        { where: { node: { author: { id: userId } } } },
        info
      );
    }
  }
};

export default Subscription;
