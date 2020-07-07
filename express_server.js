const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const express = require('express');
const app = express();
const PORT = 3001;

const { getUserByEmail, generateRandomString } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name:'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

const urlsForUser = function(id) {
  const tempDatabase = {};
  const userUrls =  Object.keys(urlDatabase).filter(elm => urlDatabase[elm].userID === id);
  userUrls.forEach((url) => tempDatabase[url] = urlDatabase[url]);
  return tempDatabase;
};

//RENDER PAGES
app.get('/urls', (req, res) => {
  let templateVars = undefined;
  if (req.session.user_id) {
    templateVars = {
      urls: urlsForUser(req.session.user_id),
      user: users[req.session.user_id]
    };
  } else {
    templateVars = { urls: undefined, user: undefined};
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  let templateVars = { user: users[req.session.user_id]};
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id],
    userUrls: userUrls
  };
  res.render("urls_show", templateVars);
});

//CREATE URL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

//DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  if (userUrls[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});

//UPDATE URL
app.post('/urls/:shortURL', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  if (userUrls[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL  = req.body.newLongUrl;
  }
  res.redirect('/urls');
});

//REDIRECT TO LONG URL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});


//Registration Routers
//LOGIN
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (!user) {
    res.status(403).send('Sorry user doesnt exist');
    return;
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.status(403).send('Password not recognize');
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.session.user_id]};
  res.render('login_page', templateVars);
});

//LOGOUT
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


//REGISTER
app.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id]};
  res.render('registration_page', templateVars);
});

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Missing something');
    return;
  }
  const user = getUserByEmail(req.body.email, users);
  if (user) {
    res.status(400).send('User exists already');
    return;
  }

  const newUser = {
    id: generateRandomString(4),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  users[newUser.id] = newUser;
  req.session.user_id = newUser.id;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});