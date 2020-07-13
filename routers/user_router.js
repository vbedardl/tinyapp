const express = require('express');
const router = express.Router();
const { users } = require('../database');
const bcrypt = require('bcrypt')
const TemplateVars = require('../Schema/TemplateVars');

router.get('/user/:id', (req, res) => {
  const templateVars = new TemplateVars();
  if (req.session.user_id) {
    templateVars.hasUserID(req.session.user_id);
  }
  res.render('edit_user', templateVars)
})

router.put('/user/:id', (req, res) => {
  const templateVars = new TemplateVars();
  if (bcrypt.compareSync(req.body.password, users[req.params.id].password) && req.session.user_id === req.params.id) {
    users[req.params.id].name = req.body.userName
    users[req.params.id].email = req.body.email
    users[req.params.id].newpassword = bcrypt.hashSync(req.body.password,10)
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasMessage('Account information updated');
  res.render('edit_user', templateVars)
  }else{
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasMessage('Wrong Password. The information was not updated');
  }
})

module.exports = router;
