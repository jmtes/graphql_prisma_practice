const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }) {
      // Make sure post exists
      const post = db.posts.find((p) => p.id === postId && p.published);
      if (!post) throw Error('Post does not exist.');

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    }
  }
};

export default Subscription;
