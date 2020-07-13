const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const { users } = require('../database');
const { getUserByEmail, generateRandomString, getUserByResetToken } = require('../helpers');
const UserObj = require('../Schema/User');
const TemplateVars = require('../Schema/TemplateVars');

//GET HOMEPAGE
router.get('/', (req, res) => {
  !req.session.user_id ?
    res.redirect('/login') :
    res.redirect('/urls');
});

//DISPLAY LOGIN FORM
router.get('/login', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  if (req.session.msg) {
    templateVars.hasMessage(req.session.msg);
    req.session.msg = null;
  }
  res.render('login_page', templateVars);
});

//DISPLAY REGISTRATION FORM
router.get('/register', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  res.render('registration_page', templateVars);
});

//LOGIN A USER
router.post('/login', (req, res) => {
  const { password, email } = req.body;
  const user = getUserByEmail(email, users);
  const templateVars = new TemplateVars();
  if (!user) {
    templateVars.hasMessage('Sorry user does not exist');
    res.render('login_page', templateVars);
    return;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    templateVars.hasMessage('Password doesnt match');
    res.render('login_page', templateVars);
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

//LOGOUT A USER
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//CREATE A NEW USER
router.post('/register', (req, res) => {
  const templateVars = new TemplateVars();
  if (!req.body.email || !req.body.password) {
    templateVars.hasMessage('Missing something');
    res.render('registration_page', templateVars);
    return;
  }

  const existingUser = getUserByEmail(req.body.email, users);
  if (existingUser) {
    templateVars.hasMessage('User already exists');
    res.render('registration_page', templateVars);
    return;
  }

  let paid = (req.body.paid === 'on' ? true : false);
  const { email, password, userName } = req.body;
  const user = new UserObj(email, password, userName, paid);
  users[user.id] = user;
  req.session.user_id = user.id;
  console.log(users)
  res.redirect('/urls');
});

router.get('/forgot-password', (req, res) => {
  const templateVars = new TemplateVars()
  res.render('forgot-page', templateVars)
})

router.post('/forgot-password', (req, res) => {
  const user = getUserByEmail(req.body.email, users)
  if(user){
    user.resetToken = generateRandomString(7)
    let transporter = nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port:465,
      secure:true,
      auth:{
        user:process.env.USERMAIL,
        pass: process.env.USERPASS
      }
    })
    let mailOptions = {
      to: req.body.email,
      subject: 'Reset password for TinyUrl',
      html: `<p>Hi, to reset your password click on the following link: <a href="${req.protocol}://${req.get('host')}/reset?token=${user.resetToken}">Reset your password</a></p>`
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
        return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
    })
  }
  const templateVars = new TemplateVars()
  templateVars.hasMessage('Reset email sent')
  res.render('forgot-page', templateVars)
})

router.get('/reset', (req, res) => {
  req.session.reset = req.query.token
  res.redirect('/reset-password')
})

router.get('/reset-password', (req, res) => {
  const user = getUserByResetToken(req.session.reset, users)
  const templateVars = new TemplateVars()
  if(!user){
  templateVars.hasMessage('Error...')
  }else{
    req.session.user_id = user.id;
  }
  res.render('reset-password', templateVars)
})

router.post('/change-password', (req, res) => {
  if(req.session.reset && req.session.user_id){
    users[req.session.user_id].password = bcrypt.hashSync(req.body.password, 10)
  }
  req.session.reset = null
  res.redirect('/urls')
})

module.exports = router;