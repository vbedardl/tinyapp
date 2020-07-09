const { generateRandomString } = require('../helpers');
const bcrypt = require('bcrypt');

class UserObj {
  constructor(email, password, paid) {
    this.id = generateRandomString(4),
    this.email = email;
    this.password = bcrypt.hashSync(password, 10),
    this.paid = paid;
  }
}
module.exports = UserObj;