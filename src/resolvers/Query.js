const Query = {
  users(parent, args, { prisma }, info) {
    // const { users } = db;
    // const query = new RegExp(args.query, 'gi');

    // return users.filter((user) => user.name.match(query));
    return prisma.query.users(null, info);
  },
  posts(parent, args, { prisma }, info) {
    // const { posts } = db;
    // const query = new RegExp(args.query, 'gi');

    // return posts.filter(
    //   (post) => post.title.match(query) || post.body.match(query)
    // );
    return prisma.query.posts(null, info);
  },
  comments(parent, args, { db }, info) {
    const { comments } = db;

    return comments;
  },
  me() {
    return {
      id: '062e98c1-ea91-4369-b52a-634b80126027',
      name: 'Juno',
      email: 'juno@domain.tld',
      age: 20
    };
  },
  post() {
    return {
      id: 'aa801b98-63c8-4907-9f6e-09e57388354a',
      title: 'i got a crush on u...',
      body:
        'theres a party down the street at my girls house u should come thru yeah i wanna see u',
      published: true
    };
  }
};

export default Query;
