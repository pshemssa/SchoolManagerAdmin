const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha512').update(password).digest('hex');
};

const comparePassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

module.exports = { hashPassword, comparePassword };
