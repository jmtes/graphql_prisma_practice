import jwt from 'jsonwebtoken';

const generateToken = (userId) =>
  jwt.sign({ userId }, 'h2v3owtpdgCZSQ7HWkCWbGF89VukYdPP', {
    expiresIn: 2400
  });

export default generateToken;
