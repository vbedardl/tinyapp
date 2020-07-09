const express = require('express');
const router = express.Router();
const { users, urlDatabase } = require('../database');
const TemplateVars = require('../Schema/TemplateVars');

//RENDER PAGES
//Redirect to /login if user is not logged in, otherwise redirect to /urls
router.get('/', (req, res) => {
  !req.session.user_id ?
    res.redirect('/login') :
    res.redirect('/urls');
});

//Render the urls_index page with some user data, if user data there is
router.get('/urls', (req, res) => {
  const templateVars = new TemplateVars();
  if (req.session.user_id) {
    templateVars.hasUserID(req.session.user_id);
  }
  if (req.session.msg) {
    templateVars.hasMessage(req.session.msg);
    req.session.msg = null;
  }
  res.render("urls_index", templateVars);
});

//Redirect to /login if user is not logged in, otherwise render the urls_news page
router.get("/urls/new", (req, res) => {
  !req.session.user_id ?
    res.redirect('/login') :
    res.render("urls_new", { user: users[req.session.user_id]});
});

//Render the urls_show page for a specified short url. Ask for connectionn if not connected. Return a message if the url does not exist
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

//Render the analytics page to logged in user, otherwise prompt them to do so.
router.get('/analytics', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(true);
  res.render("analytics", templateVars);
});

//Render the analytics page with the data of a specific short url
router.post('/analytics', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasShortURL(req.body.shortURL);
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(false);
  res.render('analytics', templateVars);
});

//Render the login page.
router.get('/login', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  if (req.session.msg) {
    templateVars.hasMessage(req.session.msg);
    req.session.msg = null;
  }
  res.render('login_page', templateVars);
});

//Render the registration page
router.get('/register', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  res.render('registration_page', templateVars);
});

module.exports = router;