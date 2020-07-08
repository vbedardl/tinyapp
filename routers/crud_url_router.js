const express = require('express')
const router = express.Router()
const { urlDatabase } = require('../database')
const { generateRandomString, urlsForUser } = require('../helpers');

//CREATE URL
router.post("/urls", (req, res) => {
  let shortURL = undefined;
  if (req.body.customURL) {
    shortURL = req.body.customURL;
  } else {
    shortURL = generateRandomString(6);
  }
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
    createdAt: new Date().toDateString(),
    visits: {
      mobile:0,
      desktop:0
    },
    referal:{},
    uniqueVisitors: {}
  };
  res.redirect(`/urls/${shortURL}`);
});

//DELETE URL
router.post('/urls/:shortURL/delete', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  if (userUrls[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});

//UPDATE URL
router.post('/urls/:shortURL', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  if (userUrls[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.newLongUrl;
  }
  res.redirect('/urls');
});

module.exports = router