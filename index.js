module.exports = function(Plugins) {
  var loadPlugins = function(req, type) {
    return Plugins[type][req.url];
  };

  var hook = function (type) {
    return function(req, res, next) {
      var pluginList = loadPlugins(req, type);
      var pluginPromises = [];
      _.forEach(pluginList, function(func) {
        pluginPromises.push(func(req, res))
      });
      Promise.all(pluginPromises).then(function() {
        next();
      }).catch(function(err) {
        next(err);
      })
    }
  };

  return {
    beforeHook: hook('before'),
    afterHook: hook('after')
  }
};
