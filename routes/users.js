var express = require('express');
var router = express.Router();
var Token = require('../utils/token');
var jwt = require('jsonwebtoken');
var DBComm = require('../db/DBComm');

var DBcof = {
  db: 'resume',
  site: 'testUser'
};
const whiteList = ['/login', '/register'];// 免token验证白名单

router.use(function(req, res, next) {
  if (whiteList.indexOf(req.url) > -1) {
    return next();
  }
  // 拿取token
  var token = req.headers['x-access-token'];
  if (token) {
    new Promise((resolve, reject) => {
      // 解码 token (验证 secret 和检查有效期（exp）)
      jwt.verify(token, 'user', function(err, decoded) {      
        if (err) {
          reject(err)
        } else {
          resolve(decoded);
        }
      });
    }).then((decoded) => {
      // 如果验证通过，在req中写入解密结果
      DBComm.find(DBcof, {token: token}, (result) => {
        if (result.length) {
          req.decoded = decoded;
          return next(); //继续下一步路由
        }
        res.json({ 
          success: false,
          token: false,
          message: '登录信息已过期！请重新登录！' 
        });
      })
    }).catch(() => {
      res.json({
        success: false,
        token: false,
        message: '登录信息已过期！请重新登录！'
      });
    })
  } else {
    // 没有拿到token 返回错误 
    res.status(403).json({ 
        success: false,
        token: false,
        message: '没有找到token' 
    });
  }
});

router.post('/register', function(req, res, next) {
  var username = req.body.username;
  new Promise((resolve, reject) => {
    DBComm.find(DBcof, {username: username}, (result) => {
      resolve(result)
    })
  }).then((result) => {
    if (result.length) {
      return res.json({
        success: false, 
        message: '用户名已存在！'
      })
    }
    var data = {
      username: username,
      password: req.body.password,
      token: Token.getToken(username, 'user')
    };
    DBComm.insert(DBcof, data, (result) => {
      res.json({
        success: true, 
        result: result,
        message: '注册成功！',
        token: data.token
      })
    })
  })
});

router.get('/resume/:username', function(req, res, next) {
  var data = {username: req.params.username};
  DBComm.find(DBcof, data, (result) => {
    if (result.length && result[0].userData) {
      var data = result[0]
      res.json({
        success: true,
        data: data.userData
      });
    } else {
      res.json({
        success: true,
        data: null
      });
    }
  })
});


router.post('/login', function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  };
  new Promise((resolve, reject) => {
    DBComm.find(DBcof, {username: data.username}, (result) => {
      resolve(result);
    });
  }).then((result) => {
    if (result.length) {
      if (result[0].password === data.password) {
        var thisToken = Token.getToken(data.name, 'user');
        DBComm.update(DBcof, data, {token: thisToken}, (result) => {
          res.json({
            success: true, 
            result: result,
            token: thisToken
          });
        });
      } else {
        res.json({
          success: false, 
          message: '密码错误！'
        });
      }
    } else {
      res.json({
        success: false, 
        result: result,
        message: '用户名不存在！'
      });
    }
  });
});

router.get('/getInfo', function(req, res, next) {
  var token = req.headers['x-access-token'];
  DBComm.find(DBcof, {token: token}, (result) => {
    if (result.length && result[0].userData) {
      var data = result[0]
      res.json({
        success: true,
        data: data.userData
      });
    } else {
      res.json({
        success: true,
        data: null
      });
    }
  })
});

router.post('/update', function(req, res, next) {
  var token = req.headers['x-access-token'];
  var data = req.body.update;
  DBComm.update(DBcof, {token: token}, data, (result) => {
    res.json({
      success: true, 
      message: '更新成功！'
    });
  });
});


module.exports = router;
