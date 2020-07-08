const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const { users } = require('../database')
const { getUserByEmail, generateRandomString } = require('../helpers');

/* LOGIN */
router.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  let templateVars = {user: undefined, message: undefined};
  if (!user) {
    templateVars.message = 'Sorry user doesnt exist';
    res.render('login_page', templateVars);
    return;
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    templateVars.message = 'Password doesnt match';
    res.render('login_page', templateVars);
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

//LOGOUT
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//REGISTER
router.post('/register', (req, res) => {
  let templateVars = {user: undefined};
  if (!req.body.email || !req.body.password) {
    templateVars.message = 'Missing something';
    res.render('registration_page', templateVars);
    return;
  }
  const user = getUserByEmail(req.body.email, users);
  if (user) {
    templateVars.message = 'User already exists';
    res.render('registration_page', templateVars);
    return;
  }
  let paid = (req.body.paid === 'on' ? true : false);
  const newUser = {
    id: generateRandomString(4),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    paid: paid
  };
  users[newUser.id] = newUser;
  req.session.user_id = newUser.id;
  res.redirect('/urls');
});

module.exports = router