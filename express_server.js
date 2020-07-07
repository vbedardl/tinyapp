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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  }
}

function generateRandomString(num){
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var randomStr = '';
  for (var i = num; i > 0; i--) randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  return randomStr;
}

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']]}
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']]}
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies['user_id']]}
  res.render("urls_show", templateVars)
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6)
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
  const userEmails = Object.keys(users).map((elm) => users[elm].email)
  if(!userEmails.includes(req.body.email)){
    res.status(403).send('Sorry user doesnt exist')
    return
  }
  const myUser = Object.keys(users).filter((elm) => users[elm].email === req.body.email)
  if(users[myUser].password !== req.body.password){
    res.status(403).send('Password not recognize')
    return
  }
  res.cookie('user_id', users[myUser].id)
  res.redirect('/urls')
})
app.post('/logout', (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']]}
  res.render('registration_page', templateVars)
})

app.post('/register', (req, res) => {
  if(!req.body.email || !req.body.password){
    res.status(400).send('Missing something')
    return
  }
  const userEmails = Object.keys(users).map((elm) => users[elm].email)
  if(userEmails.includes(req.body.email)){
    res.status(400).send('User exists already')
    return
  }
  const newUser = {
    id: generateRandomString(4),
    email: req.body.email,
    password: req.body.password
  }
  users[newUser.id] = newUser
  res.cookie('user_id', newUser.id)
  res.redirect('/urls')
})

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']]}
  res.render('login_page', templateVars)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})