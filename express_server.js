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
    password: "purple-monkey-dinosaur",
    paid: false
  }
};

const urlsForUser = function(id) {
  const tempDatabase = {};
  const userUrls =  Object.keys(urlDatabase).filter(elm => urlDatabase[elm].userID === id);
  userUrls.forEach((url) => tempDatabase[url] = urlDatabase[url]);
  return tempDatabase;
};

//RENDER PAGES
app.get('/', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.redirect('/urls');
});

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

app.get('/analytics', (req, res) => {
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

app.post('/analytics', (req, res) => {
  let templateVars = {
    mobileCount: urlDatabase[req.body.shortURL].visits.mobile,
    desktopCount: urlDatabase[req.body.shortURL].visits.desktop,
    user: users[req.session.user_id],
    url: urlDatabase[req.body.shortURL]
  };
  res.render('analytics', templateVars);
});

//CREATE URL
app.post("/urls", (req, res) => {
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
  if (req.get('user-agent').includes('Mobi')) {
    urlDatabase[req.params.shortURL].visits.mobile ++;
  } else {
    urlDatabase[req.params.shortURL].visits.desktop ++;
  }
  if (!urlDatabase[req.params.shortURL].referal[req.headers.referer]) {
    urlDatabase[req.params.shortURL].referal[req.headers.referer] = 0;
  }
  if (!req.session.visitor_id) {
    req.session.visitor_id = generateRandomString(4);
    urlDatabase[req.params.shortURL].uniqueVisitors[req.session.visitor_id] = 0;
  }
  urlDatabase[req.params.shortURL].referal[req.headers.referer] ++;
  urlDatabase[req.params.shortURL].uniqueVisitors[req.session.visitor_id] ++;

  console.log(urlDatabase);
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});


//Registration Routers
//LOGIN
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  let templateVars = {};
  if (!user) {
    templateVars.message = 'Sorry user doesnt exist';
    templateVars.user = undefined;
    res.render('login_page', templateVars);
    // res.status(403).send('Sorry user doesnt exist');
    return;
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    templateVars.message = 'Password doesnt match';
    templateVars.user = undefined;

    res.render('login_page', templateVars);
    // res.status(403).send('Password not recognize');
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.session.user_id], message: undefined};
  res.render('login_page', templateVars);
});

//LOGOUT
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


//REGISTER
app.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id], message: undefined};
  res.render('registration_page', templateVars);
});

app.post('/register', (req, res) => {
  let templateVars = {};
  if (!req.body.email || !req.body.password) {
    templateVars.message = 'Missing something';
    templateVars.user = undefined;
    // res.status(400).send('Missing something');
    res.render('registration_page', templateVars);
    return;
  }
  const user = getUserByEmail(req.body.email, users);
  if (user) {
    templateVars.message = 'User already exists';
    templateVars.user = undefined;
    // res.status(400).send('User exists already');
    res.render('registration_page', templateVars);
    return;
  }
  let paid = (req.body.paid === 'on' ? true : false);
  const newUser = {
    id: generateRandomString(4),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    paid: paid
  };
  users[newUser.id] = newUser;
  req.session.user_id = newUser.id;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});