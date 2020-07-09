const { urlsForUser } = require('../helpers');
const { users, urlDatabase } = require('../database');

class TemplateVars {
  constructor() {
    this.msg = undefined,
    this.urls = undefined,
    this.user = undefined,
    this.shortURL = undefined,
    this.longURL = undefined,
    this.userUrls = undefined,
    this.fullPath = undefined,
    this.mobileCount = undefined,
    this.desktopCount = undefined,
    this.url = undefined;
  }
  hasShortURL(shortURL) {
    this.shortURL = shortURL;
    this.longURL = urlDatabase[shortURL].longURL;
    this.url = urlDatabase[shortURL];
  }
  hasUserID(userId) {
    this.user = users[userId];
    this.userUrls = urlsForUser(userId);
  }
  hasMsg(msg) {
    this.msg = msg;
  }
  clickCount(global) {
    if (global) {
      this.mobileCount = Object.keys(this.userUrls).map((url) => this.userUrls[url].visits.mobile).reduce((a, b) => a + b);
      this.desktopCount = Object.keys(this.userUrls).map((url) => this.userUrls[url].visits.desktop).reduce((a, b) => a + b);
    } else {
      this.mobileCount = urlDatabase[this.shortURL].visits.mobile;
      this.desktopCount = urlDatabase[this.shortURL].visits.desktop;
    }
  }
}

module.exports = TemplateVars;