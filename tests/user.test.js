import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase from './utils/seedDatabase';

const client = getClient();

describe('User', () => {
  beforeEach(seedDatabase);

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
