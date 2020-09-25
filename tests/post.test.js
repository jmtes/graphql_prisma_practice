import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, { userOne, postOne } from './utils/seedDatabase';

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

  test('updatePost should update post in DB', async () => {
    const client = getClient(userOne.jwt);

    const updatePost = gql`
      mutation {
        updatePost(
          id: "${postOne.post.id}"
          data: {
            title: "Updated title",
            body: "Updated body",
            published: false
          }
        ) {
          title
          body
          published
        }
      }
    `;

    const { data } = await client.mutate({ mutation: updatePost });

    expect(data.updatePost.title).toBe('Updated title');
    expect(data.updatePost.body).toBe('Updated body');
    expect(data.updatePost.published).toBe(false);
  });
});
