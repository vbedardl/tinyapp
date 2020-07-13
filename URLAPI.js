const request = require('request')

const getUrlData = function(options, callback){
  request(options, (err, response, body) => {
    if(err){
      callback(err, null)
      return
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(err, JSON.parse(response.body));
  })
}

module.exports = getUrlData