var jwt = require('jsonwebtoken');

var Token = {
  getToken (name, key) {
    var content = {name: name};
    return jwt.sign(content, key, {
      expiresIn: 60 * 60 * 24  // 1天过期
    });
  }
}

module.exports = Token;