const { urlDatabase} = require('./database')

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

const urlsForUser = function(id) {
  const tempDatabase = {};
  const userUrls =  Object.keys(urlDatabase).filter(elm => urlDatabase[elm].userID === id);
  userUrls.forEach((url) => tempDatabase[url] = urlDatabase[url]);
  return tempDatabase;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser
};