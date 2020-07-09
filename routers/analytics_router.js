const express = require('express');
const router = express.Router();
const TemplateVars = require('../Schema/TemplateVars');

//GET ANALYTIC PAGE
router.get('/', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(true);
  res.render("analytics", templateVars);
});

//GET ANALYTICS PAGE FOR A SPECIFIC URL
router.get('/url', (req, res) => {
  const templateVars = new TemplateVars();
  templateVars.hasShortURL(req.query.short);
  templateVars.hasUserID(req.session.user_id);
  templateVars.clickCount(false);
  res.render('analytics', templateVars);
});


module.exports = router;