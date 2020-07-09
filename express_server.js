const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const registrationRouter = require('./routers/registration_routers');
const urlRouter = require('./routers/url_router');
const analyticsRouter = require('./routers/analytics_router');
const redirectionRouter = require('./routers/redirection_router');

const express = require('express');
let methodOverride = require('method-override');
const app = express();
const PORT = 3001;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name:'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'ejs');

app.use('/', registrationRouter);
app.use('/urls', urlRouter);
app.use('/analytics', analyticsRouter);
app.use('/', redirectionRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});