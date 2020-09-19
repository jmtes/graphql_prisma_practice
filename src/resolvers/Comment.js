const Comment = {
  author(parent, args, { db }, info) {
    const { users } = db;

    return users.find((user) => user.id === parent.author);
  },
  post(parent, args, { db }, info) {
    const { posts } = db;

    return posts.find((post) => post.id === parent.post);
  }
};

export default Comment;
