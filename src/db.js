const users = [
  {
    id: '1',
    name: 'Juno',
    email: 'juno@domain.tld',
    age: 20
  },
  {
    id: '2',
    name: 'Ian',
    email: 'ian@domain.tld',
    age: 21
  },
  {
    id: '3',
    name: 'Isabel',
    email: 'isabel@domain.tld'
  }
];

const posts = [
  {
    id: '1',
    title: 'my boy builds coffins',
    body:
      'he does it with love and with care but theyre all thrown in the ground and it just isnt fair!!',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'my ghost, where did you go',
    body: 'i cant find you in the body sleeping next to me...',
    published: true,
    author: '3'
  },
  {
    id: '3',
    title: 'i like everything abt u <3',
    body: 'like ur mind, like ur style, like ur eyes, i could die',
    published: true,
    author: '1'
  }
];

const comments = [
  {
    id: '1',
    text:
      'i think its a shame that when each coffins been made he cant see it again',
    author: '2',
    post: '1'
  },
  {
    id: '2',
    text: 'what happened to the soul that u used to be </3',
    author: '1',
    post: '2'
  },
  {
    id: '3',
    text: 'dont you hold me back cuz i know when i know i dont wanna be alone',
    author: '2',
    post: '3'
  },
  {
    id: '4',
    text: 'each one is unique, no two are the same!',
    author: '3',
    post: '1'
  }
];

const db = { users, posts, comments };

export default db;
