import { gql } from 'apollo-boost';

export const getPosts = gql`
  query {
    posts {
      id
      title
      body
      published
    }
  }
`;

export const getMyPosts = gql`
  query {
    myPosts {
      id
      title
      body
      published
    }
  }
`;

export const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
    }
  }
`;

export const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      title
      body
      published
    }
  }
`;

export const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const subscribeToPosts = gql`
  subscription {
    post {
      mutation
      node {
        title
        author {
          name
        }
      }
    }
  }
`;
