var path = require("path");
var fs = require("fs");

function util() {}

//Stringify circular referenced obj
util.stringifyObj = (obj) => {
  var cache = [];
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
};

util.readAllFiles = (dir) => {
  var files = fs.readdirSync(dir);
  var certs = [];
  files.forEach((file_name) => {
    let file_path = path.join(dir,file_name);
    let data = fs.readFileSync(file_path);
    certs.push(data);
  });
  return certs;
};

util.getUser = (req) => {
  if(req && req.session && req.session.passport
    && req.session.passport.user){
    return req.session.passport.user;
  }
  return {
    "id":"",
    "role":""
  }
};

module.exports = util;
