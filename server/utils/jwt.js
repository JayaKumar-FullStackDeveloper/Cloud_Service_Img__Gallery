// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, 'your_secret_key', { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'your_secret_key');
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
