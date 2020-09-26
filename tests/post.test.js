import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';

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

  test('updatePost mutation should update post in DB', async () => {
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

    // Check returned data
    expect(data.updatePost.title).toBe('Updated title');
    expect(data.updatePost.body).toBe('Updated body');
    expect(data.updatePost.published).toBe(false);

    // Check DB
    const postExists = await prisma.exists.Post({
      id: postOne.post.id,
      title: 'Updated title',
      body: 'Updated body',
      published: false
    });

    expect(postExists).toBe(true);
  });

  test('createPost mutation should create a new post in the DB', async () => {
    const client = getClient(userOne.jwt);

    const createPost = gql`
      mutation {
        createPost(
          data: { title: "A new post", body: "Testing!", published: true }
        ) {
          id
        }
      }
    `;

    const { data } = await client.mutate({ mutation: createPost });

    const newPostExists = await prisma.exists.Post({
      id: data.createPost.id,
      title: 'A new post',
      body: 'Testing!',
      published: true,
      author: { id: userOne.user.id }
    });

    expect(newPostExists).toBe(true);
  });

  test('deletePost mutation should delete post from DB', async () => {
    const client = getClient(userOne.jwt);

    const deletePost = gql`
      mutation {
        deletePost(
          id: "${postTwo.post.id}"
        ) {
          id
        }
      }
    `;

    const { data } = await client.mutate({ mutation: deletePost });

    const postExists = await prisma.exists.Post({ id: data.deletePost.id });

    expect(postExists).toBe(false);
  });
});
