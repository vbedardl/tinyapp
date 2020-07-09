const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('../database');
const { getUserByEmail } = require('../helpers');
const UserObj = require('../Schema/User');
const TemplateVars = require('../Schema/TemplateVars');


/* LOGIN */
router.post('/login', (req, res) => {
  const { password, email } = req.body;
  const user = getUserByEmail(email, users);
  const templateVars = new TemplateVars();
  if (!user) {
    templateVars.hasMsg('Sorry user does not exist');
    res.render('login_page', templateVars);
    return;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    templateVars.hasMsg('Password doesnt match');
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
  const templateVars = new TemplateVars();
  if (!req.body.email || !req.body.password) {
    templateVars.hasMsg('Missing something');
    res.render('registration_page', templateVars);
    return;
  }

  const existingUser = getUserByEmail(req.body.email, users);
  if (existingUser) {
    templateVars.hasMsg('User already exists');
    res.render('registration_page', templateVars);
    return;
  }

  let paid = (req.body.paid === 'on' ? true : false);
  const { email, password } = req.body;
  const user = new UserObj(email, password, paid);
  users[user.id] = user;
  req.session.user_id = user.id;
  res.redirect('/urls');
});

module.exports = router;