var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var compose = require('connect-compose');
var Hook = require('../index');
var app = express();

var plugins = {
  before: {
    '/test1': [loadUser]
  },
  after: {
    '/test1': []
  }
};

function loadUser(req) {
  return User.findOne().then(function(u) {
    req.hook = {};
    req.hook.user = u;
  })
}

var expressHook = Hook(plugins);
var beforeHook = expressHook.beforeHook;
var afterHook = expressHook.afterHook;


app.get('/test1', beforeHook, function (req, res, next) {
  res.json(req.hook);
  next();
}, afterHook);


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
