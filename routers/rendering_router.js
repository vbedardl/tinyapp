const express = require('express')
const router = express.Router()
const { users, urlDatabase } = require('../database')
const { urlsForUser } = require('../helpers');

//RENDER PAGES
router.get('/', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  res.redirect('/urls');
});

router.get('/urls', (req, res) => {
  let templateVars = { urls: undefined, user: undefined, msg: undefined};
  if (req.session.user_id) {
    templateVars.urls = urlsForUser(req.session.user_id);
    templateVars.user = users[req.session.user_id];
  }
  if (req.session.msg) {
    templateVars.msg = req.session.msg;
    req.session.msg = null;
  }
  res.render("urls_index", templateVars);
});

router.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  let templateVars = { user: users[req.session.user_id]};
  res.render("urls_new", templateVars);
});

router.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const userUrls = urlsForUser(req.session.user_id);
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id],
      userUrls: userUrls,
      fullPath: req.protocol + '://' + req.get('host'),
    };
    res.render("urls_show", templateVars);
  } else {
    req.session.msg = 'This tiny URL does not exist';
    res.redirect('/');
  }
});

router.get('/analytics', (req, res) => {
  let userUrls = urlsForUser(req.session.user_id);
  let mobileCount = Object.keys(userUrls).map((url) => userUrls[url].visits.mobile).reduce((a, b) => a + b);
  let desktopCount = Object.keys(userUrls).map((url) => userUrls[url].visits.desktop).reduce((a, b) => a + b);
  let templateVars = {
    user: users[req.session.user_id],
    userUrls: urlsForUser(req.session.user_id),
    mobileCount,
    desktopCount,
    url: undefined
  };
  res.render("analytics", templateVars);
});

router.post('/analytics', (req, res) => {
  let templateVars = {
    mobileCount: urlDatabase[req.body.shortURL].visits.mobile,
    desktopCount: urlDatabase[req.body.shortURL].visits.desktop,
    user: users[req.session.user_id],
    url: urlDatabase[req.body.shortURL]
  };
  res.render('analytics', templateVars);
});


router.get('/login', (req, res) => {
  let templateVars = { user: users[req.session.user_id], message: undefined};
  res.render('login_page', templateVars);
});

router.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id], message: undefined};
  res.render('registration_page', templateVars);
});

module.exports = router