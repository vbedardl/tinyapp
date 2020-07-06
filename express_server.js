const { request } = require("express");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const express = require('express')
const app = express()
const PORT = 3001

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set('view engine', 'ejs')

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

function generateRandomString(){
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var randomStr = '';
  for (var i = 6; i > 0; i--) randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  return randomStr;
}

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['username']}
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies['username']}
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username']}
  res.render("urls_show", templateVars)
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
})

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL]  = req.body.newLongUrl
  res.redirect('/urls')
})

app.get("/u/:shortURL", (req, res) => {  
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls')
})
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})