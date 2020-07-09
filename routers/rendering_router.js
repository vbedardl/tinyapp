const express = require('express');
const router = express.Router();
const { users, urlDatabase } = require('../database');
const TemplateVars = require('../Schema/TemplateVars');

//RENDER PAGES
router.get('/', (req, res) => {
  !req.session.user_id ?
    res.redirect('/login') :
    res.redirect('/urls');
});

router.get('/urls', (req, res) => {
  const templateVars = new TemplateVars();
  if (req.session.user_id) {
    templateVars.hasUserID(req.session.user_id);
  }
  if (req.session.msg) {
    templateVars.hasMsg(req.session.msg);
    req.session.msg = null;
  }
  res.render("urls_index", templateVars);
});

router.get("/urls/new", (req, res) => {
  !req.session.user_id ?
    res.redirect('/login') :
    res.render("urls_new", { user: users[req.session.user_id]});
});

router.get('/urls/:shortURL', (req, res) => {
  const templateVars = new TemplateVars();
  const { shortURL } = req.params;
  if (urlDatabase[shortURL]) {
    templateVars.hasUserID(req.session.user_id);
    templateVars.hasShortURL(shortURL);
    templateVars.fullPath = req.protocol + '://' + req.get('host');
    res.render("urls_show", templateVars);
  } else {
    req.session.msg = 'This tiny URL does not exist';
    res.redirect('/');
  }
});

router.get('/analytics', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(true);
  res.render("analytics", templateVars);
});

router.post('/analytics', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasShortURL(req.body.shortURL);
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(false);
  res.render('analytics', templateVars);
});


router.get('/login', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  if (req.session.msg) {
    templateVars.hasMsg(req.session.msg);
    req.session.msg = null;
  }
  res.render('login_page', templateVars);
});

router.get('/register', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  res.render('registration_page', templateVars);
});

module.exports = router;