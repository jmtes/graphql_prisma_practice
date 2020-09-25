import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4000/'
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts(orderBy: createdAt_DESC) {
      title
      author {
        name
      }
    }
  }
`;

client.query({ query: getUsers }).then(({ data }) => {
  const { users } = data;

  const userList = document.getElementById('user-list');

  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.name;

    userList.appendChild(li);
  });
});

client.query({ query: getPosts }).then(({ data }) => {
  const { posts } = data;

  const feed = document.getElementById('posts');

  posts.forEach((post) => {
    feed.innerHTML += `
      <div>
        <h3>${post.title.replace('<', '')}</h3>
        <p>${post.author.name}</p>
      </div>
    `;
  });
});
