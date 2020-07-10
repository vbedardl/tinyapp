const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const registrationRouter = require('./routers/registration_routers');
const urlRouter = require('./routers/url_router');
const analyticsRouter = require('./routers/analytics_router');
const redirectionRouter = require('./routers/redirection_router');

const express = require('express');
let methodOverride = require('method-override');

const passport = require('passport');  //GOOGLEAUTH
require('./passport-setup')           //GOOGLEAUTH

const app = express();
const PORT = 3001;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name:'session',
  keys: ['key1', 'key2']
}));

const isLoggedIn = (req, res, next) => {
  if(req.user){
    next()
  }else{
    res.sendStatus(401)
  }
}

app.use(passport.initialize())      //GOOGLEAUTH
app.use(passport.session())         //GOOGLEAUTH

app.set('view engine', 'ejs');

app.use('/', registrationRouter);
app.use('/urls', urlRouter);
app.use('/analytics', analyticsRouter);
app.use('/', redirectionRouter);


//GOOGLEAUTH
app.get('/failed', (req, res) => res.send('You failed to log in'))
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.profile}`))

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/good');
  });
  //GOOGLEAUTH

  app.get('/*', (req, res) => {
    res.render('404', {user:null})
  })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});