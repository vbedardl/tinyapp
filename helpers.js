const { urlDatabase} = require('./database');

//return a user object from the user database given an email
const getUserByEmail = function(email, database) {
  const user = Object.keys(database).filter(user => database[user].email === email);
  return database[user];
};

//return a random string from 09-az-AZ characters given the amount of characters desired(num)
const generateRandomString = function(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = num; i > 0; i--) {
    randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomStr;
};

//return a filtered set of url objects given a user id
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