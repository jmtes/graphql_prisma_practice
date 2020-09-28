import { gql } from 'apollo-boost';

export const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
      text
    }
  }
`;
