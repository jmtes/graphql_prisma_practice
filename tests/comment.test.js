import 'cross-fetch/polyfill';

import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo
} from './utils/seedDatabase';

import { deleteComment } from './operations/comment';

describe('Comment', () => {
  beforeEach(seedDatabase);

  test('Should be able to delete own comment', async () => {
    const variables = { id: commentTwo.comment.id };

    const client = getClient(userOne.jwt);

    const { data } = await client.mutate({
      mutation: deleteComment,
      variables
    });

    expect(data.deleteComment.id).toBe(commentTwo.comment.id);
    expect(data.deleteComment.text).toBe('Test Comment 2');

    const commentExists = await prisma.exists.Comment({
      id: commentTwo.comment.id
    });

    expect(commentExists).toBe(false);
  });

  test('Should not be able to delete comments of other users', async () => {
    const variables = { id: commentOne.comment.id };

    const client = getClient(userOne.jwt);

    expect(
      client.mutate({ mutation: deleteComment, variables })
    ).rejects.toThrow('Unable to delete comment.');

    const commentStillExists = await prisma.exists.Comment({
      id: commentTwo.comment.id
    });

    expect(commentStillExists).toBe(true);
  });
});
