import '@babel/polyfill/noConflict';

import server from './server';

// Start server
server.start(() => {
  console.log('Server is up!');
});
