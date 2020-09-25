import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase from './utils/seedDatabase';

const client = getClient();

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

    const { data } = await client.query({ query: getPosts });

    expect(data.posts.length).toBe(1);
    expect(data.posts[0].published).toBe(true);
    expect(data.posts[0].title).toBe('A Published Post');
    expect(data.posts[0].body).toBe('We are live!');
  });
});
