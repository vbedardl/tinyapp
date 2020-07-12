/* const request = require('request')
const base64Credentials = Buffer.from('vincent@pocketstrategist.ca:qUJtSZer5d0vbI6a0eJA').toString('base64')

const options = {
  url: 'https://moin.im/face.png',
  headers: {
    'Authorization': 'Basic ' + base64Credentials
  }
}  

function callback(error, response, body) {
  if (!error && response.statusCode === 200) {
    let data = JSON.parse(body)

    if (data.result.status == 'OK') {
      return (data.meta)
    } else {
      console.log(data.result.reason)
    }
  } else {
    console.log(error, body)
  }
}
 */

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
/*   getMetaData(){
    request(options, callback)
  } */
}

module.exports = UrlObject;