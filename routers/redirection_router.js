const express = require('express')
const router = express.Router()
const { urlDatabase } = require('../database')
const { generateRandomString } = require('../helpers');

//REDIRECT TO LONG URL
router.get("/u/:shortURL", (req, res) => {
  const currentURL = urlDatabase[req.params.shortURL]
  if (currentURL) {
    req.get('user-agent').includes('Mobi') ?
    currentURL.visits.mobile ++ :
    currentURL.visits.desktop ++;

    if (!currentURL.referal[req.headers.referer]) {
      currentURL.referal[req.headers.referer] = 0;
    }
    if (!req.session.visitor_id) {
      req.session.visitor_id = generateRandomString(4);
      currentURL.uniqueVisitors[req.session.visitor_id] = 0;
    }
    currentURL.referal[req.headers.referer] ++;
    currentURL.uniqueVisitors[req.session.visitor_id] ++;

    res.redirect(`${currentURL.longURL}`);
  } else {
    req.session.msg = 'tinyURL does not exist';
    res.redirect('/');
  }
});

module.exports = router