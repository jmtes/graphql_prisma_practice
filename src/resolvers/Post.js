const Post = {
  author(parent, args, { db }, info) {
    const { users } = db;

    return users.find((user) => user.id === parent.author);
  },
  comments(parent, args, { db }, info) {
    const { comments } = db;

    return comments.filter((comment) => comment.post === parent.id);
  }
};

export default Post;
