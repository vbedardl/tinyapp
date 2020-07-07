const { assert } = require('chai');
const { getUserByEmail } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert(user, expectedOutput);// Write your assert statement here
  });

  it('should return undefined if using user with invalid email', function() {
    const user = getUserByEmail("vincent@example.com", testUsers);
    assert.isUndefined(user, 'User is undefined');// Write your assert statement here
  });
});