import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const header = req.request.headers.authorization;
  if (!header) throw Error('Authentication required.');

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'h2v3owtpdgCZSQ7HWkCWbGF89VukYdPP');

  return decoded.userId;
};

export default getUserId;
