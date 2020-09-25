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
        name: 'Emma Thomas',
        email: 'emma@domain.tld',
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

  test('New user should be created in DB upon registration', async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "Kate Page"
            email: "kate@domain.tld"
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
      email: 'kate@domain.tld',
      id: data.createUser.user.id
    });

    expect(userExists).toBe(true);
  });

  test('User registration should fail if password is too short', async () => {
    const badReg = gql`
      mutation {
        createUser(
          data: {
            name: "Kate Page"
            email: "kate@domain.tld"
            password: "2short"
          }
        ) {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: badReg })).rejects.toThrow(
      'Password must contain at least 8 characters.'
    );
  });

  test('User emails should be hidden in public profiles', async () => {
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
    expect(data.users[0].name).toBe('Emma Thomas');
  });

  test('Login should succeed with valid credentials', async () => {
    const login = gql`
      mutation {
        loginUser(data: { email: "emma@domain.tld", password: "QhzuCsao" }) {
          token
          user {
            name
          }
        }
      }
    `;

    const { data } = await client.mutate({ mutation: login });

    expect(data.loginUser.token).toBeTruthy();
    expect(data.loginUser.user.name).toBe('Emma Thomas');
  });

  test('Login should fail with nonexistent email', async () => {
    const invalidLogin = gql`
      mutation {
        loginUser(
          data: { email: "doesntexist@domain.tld", password: "akdasjlsafj" }
        ) {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: invalidLogin })).rejects.toThrow(
      'Account does not exist.'
    );
  });

  test('Login should fail with incorrect password', async () => {
    const invalidLogin = gql`
      mutation {
        loginUser(data: { email: "emma@domain.tld", password: "incorrect" }) {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: invalidLogin })).rejects.toThrow(
      'Incorrect password.'
    );
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
        name: 'Emma Thomas',
        email: 'emma@domain.tld',
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
