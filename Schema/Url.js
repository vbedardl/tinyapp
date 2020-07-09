class UrlObject {
  constructor(longURL, userID) {
    this.longURL = longURL,
    this.userID = userID,
    this.createdAt = new Date().toDateString(),
    this.visits = {
      mobile:0,
      desktop:0
    },
    this.referal = {},
    this.uniqueVisitors = {};
  }
}

module.exports = UrlObject;