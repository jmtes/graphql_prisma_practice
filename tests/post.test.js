import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, { userOne } from './utils/seedDatabase';

const defaultClient = getClient();

describe('Post', () => {
  beforeEach(seedDatabase);

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

    const { data } = await defaultClient.query({ query: getPosts });

    expect(data.posts.length).toBe(1);
    expect(data.posts[0].published).toBe(true);
    expect(data.posts[0].title).toBe('A Published Post');
    expect(data.posts[0].body).toBe('We are live!');
  });

  test('myPosts query should return all posts owned by user', async () => {
    const client = getClient(userOne.jwt);

    const getMyPosts = gql`
      query {
        myPosts {
          id
          title
          body
          published
        }
      }
    `;

    const { data } = await client.query({ query: getMyPosts });

    expect(data.myPosts.length).toBe(2);
  });
});
