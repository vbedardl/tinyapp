const getUserByEmail = function(email, database) {
  const user = Object.keys(database).filter(user => database[user].email === email);
  return database[user];
};

const generateRandomString = function(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = num; i > 0; i--) {
    randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomStr;
};

module.exports = {
  getUserByEmail,
  generateRandomString
};