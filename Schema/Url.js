class UrlObject {
  constructor(longURL, userID, u) {
    this.longURL = longURL,
    this.userID = userID,
    this.createdAt = new Date(),
    this.visits = {
      mobile:0,
      desktop:0
    },
    this.referal = {},
    this.uniqueVisitors = {};
    this.urlTitle = longURL,
    this.u = u,
    this.metaData = undefined
  } 
}

module.exports = UrlObject;