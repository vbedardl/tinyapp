const express = require('express');
const router = express.Router();
const { urlDatabase } = require('../database');
const { generateRandomString } = require('../helpers');

//REDIRECT TO LONG URL
router.get("/u/:shortURL", (req, res) => {
  const currentURL = urlDatabase[req.params.shortURL];
  if (currentURL) {
    const { visits, referal, uniqueVisitors, longURL } = currentURL;
    const { referer } = req.headers;

    req.get('user-agent').includes('Mobi') ?
      visits.mobile ++ :
      visits.desktop ++;

    if (!referal[referer]) {
      referal[referer] = 0;
    }
    if (!req.session.visitor_id) {
      req.session.visitor_id = generateRandomString(4);
      uniqueVisitors[req.session.visitor_id] = 0;
    }
    referal[referer] ++;
    uniqueVisitors[req.session.visitor_id] ++;

    res.redirect(`${longURL}`);
  } else {
    req.session.msg = 'tinyURL does not exist';
    res.redirect('/');
  }
});

module.exports = router;