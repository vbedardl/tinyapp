const express = require('express');
const router = express.Router();
const { urlDatabase } = require('../database');
const { generateRandomString, urlsForUser } = require('../helpers');
const UrlObject = require('../Schema/Url');

//CREATE URL
router.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let shortURL = undefined;
    req.body.customURL ?
      shortURL = req.body.customURL :
      shortURL = generateRandomString(6);
    urlDatabase[shortURL] = new UrlObject(req.body.longURL, req.session.user_id);
    res.redirect(`/urls/${shortURL}`);
  } else {
    req.session.msg = 'You need to be logged in to do this';
    res.redirect('/');
  }
});

//DELETE URL
router.delete('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const userUrls = urlsForUser(req.session.user_id);
    userUrls[req.params.shortURL] ?
      delete urlDatabase[req.params.shortURL] :
      req.session.msg = `You can't delete a url that is not yours`;
  } else {
    req.session.msg = `You can't delete a url if you are not logged in`;
  }
  res.redirect('/urls');
  
});

//UPDATE URL
router.put('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    const userUrls = urlsForUser(req.session.user_id);
    userUrls[req.params.shortURL] ?
      urlDatabase[req.params.shortURL].longURL = req.body.newLongUrl :
      req.session.msg = `You can't update a url that is not yours`;
  } else {
    req.session.msg = `You can't update a url if you are not logged in`;
  }
  res.redirect('/urls');
});

module.exports = router;
