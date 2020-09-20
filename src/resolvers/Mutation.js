import { v4 as uuid } from 'uuid';

// It's largely unnecessary to make your own checks for things such as whether or not a resource actually exists because Prisma can do it for you.
// You should do it though if you want more control over what your error messages say!

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    return prisma.mutation.createUser(data, info);
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  async deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createPost(parent, { data }, { db, pubsub }, info) {
    const { users, posts } = db;

    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) throw new Error('User does not exist.');

    const newPost = { id: uuid(), ...data };
    posts.push(newPost);
    if (newPost.published)
      pubsub.publish('post', { post: { mutation: 'CREATED', data: newPost } });

    return newPost;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const { posts } = db;

    // Check if post exists
    const post = posts.find((post) => post.id === id);
    if (!post) throw new Error('Post does not exist.');

    const originalPost = { ...post };

    if (data.title !== undefined) post.title = data.title;
    if (data.body !== undefined) post.body = data.body;

    if (data.published !== undefined) {
      post.published = data.published;

      // Post has always been public
      if (originalPost.published && post.published)
        pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
      // Post has been made public
      else if (!originalPost.published && post.published)
        pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
      // Post has been made not public
      else if (originalPost.published && !post.published)
        pubsub.publish('post', {
          post: { mutation: 'DELETED', data: originalPost }
        });
    } else if (post.published)
      pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const { posts } = db;
    let { comments } = db;

    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex < 0) throw new Error('Post does not exist.');

    const [deletedPost] = posts.splice(postIndex, 1);

    comments = comments.filter((comment) => comment.post !== id);

    if (deletedPost.published)
      pubsub.publish('post', {
        post: { mutation: 'DELETED', data: deletedPost }
      });

    return deletedPost;
  },
  createComment(parent, { data }, { db, pubsub }, info) {
    const { users, posts, comments } = db;

    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) throw new Error('User does not exist.');

    const postExists = posts.some(
      (post) => post.id === data.post && post.published
    );
    if (!postExists) throw new Error('Post does not exist.');

    const newComment = { id: uuid(), ...data };
    comments.push(newComment);
    pubsub.publish(`comment ${data.post}`, {
      comment: { mutation: 'CREATED', data: newComment }
    });

    return newComment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const { comments } = db;

    // Check if comment exists
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) throw new Error('Comment does not exist.');

    if (data.text) comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'UPDATED', data: comment }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const { comments } = db;

    const commentIndex = comments.findIndex((comment) => comment.id === id);
    if (commentIndex < 0) throw new Error('Comment does not exist.');

    const [deletedComment] = comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: 'DELETED', data: deletedComment }
    });

    return deletedComment;
  }
};

export default Mutation;
