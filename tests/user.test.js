import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';

import prisma from '../src/prisma';

const client = new ApolloBoost({ uri: 'http://localhost:4000' });

describe('User', () => {
  beforeEach(async () => {
    // Wipe database
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // Create dummy user
    const user = await prisma.mutation.createUser({
      data: {
        name: 'Marion Rey',
        email: 'marion@domain.tld',
        password: bcrypt.hashSync('QhzuCsao')
      }
    });

    // Create dummy posts
    await prisma.mutation.createPost({
      data: {
        title: 'A Published Post',
        body: 'We are live!',
        published: true,
        author: { connect: { id: user.id } }
      }
    });
    await prisma.mutation.createPost({
      data: {
        title: 'A Draft Post',
        body: 'Not finished yet!',
        published: false,
        author: { connect: { id: user.id } }
      }
    });
  });

  test('Should create a new user', async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "Juno Tesoro"
            email: "juno@domain.tld"
            password: "QhzuCsao"
          }
        ) {
          token
          user {
            name
            email
            password
          }
        }
      }
    `;

    const { data } = await client.mutate({ mutation: createUser });

    const userExists = await prisma.exists.User({
      email: 'juno@domain.tld',
      id: data.createUser.user.id
    });

    expect(userExists).toBe(true);
  });

  test('Should hide user emails in public profiles', async () => {
    const getUsers = gql`
      query {
        users {
          id
          name
          email
        }
      }
    `;

    const { data } = await client.query({ query: getUsers });

    expect(data.users.length).toBe(1);
    expect(data.users[0].email).toBe(null);
    expect(data.users[0].name).toBe('Marion Rey');
  });
});

describe('Post', () => {
  beforeEach(async () => {
    // Wipe database
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // Create dummy user
    const user = await prisma.mutation.createUser({
      data: {
        name: 'Marion Rey',
        email: 'marion@domain.tld',
        password: bcrypt.hashSync('QhzuCsao')
      }
    });

    // Create dummy posts
    await prisma.mutation.createPost({
      data: {
        title: 'A Published Post',
        body: 'We are live!',
        published: true,
        author: { connect: { id: user.id } }
      }
    });
    await prisma.mutation.createPost({
      data: {
        title: 'A Draft Post',
        body: 'Not finished yet!',
        published: false,
        author: { connect: { id: user.id } }
      }
    });
  });

  test('Posts query should only return published posts', async () => {
    const getPosts = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const { data } = await client.query({ query: getPosts });

    expect(data.posts.length).toBe(1);
    expect(data.posts[0].published).toBe(true);
    expect(data.posts[0].title).toBe('A Published Post');
    expect(data.posts[0].body).toBe('We are live!');
  });
});
