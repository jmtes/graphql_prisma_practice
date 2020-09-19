const User = {
  posts(parent, args, { db }, info) {
    const { posts } = db;

    return posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    const { comments } = db;

    return comments.filter((comment) => comment.author === parent.id);
  }
};

export default User;
