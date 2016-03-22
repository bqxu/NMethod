/**
 * Created by bqxu on 15/12/17.
 */
var authService = require("../service/auth_service");
var tools = require("../../tools");
module.exports = function (option) {
  option = option || {};
  var ignore = option['ignore'] || [];
  var ignoreAll = option['ignoreAll'];
  return function authMiddleware(req, res, next) {
    var userInfo = authService.getUser(req);
    tools.saveUser(userInfo);
    if (ignoreAll) {
      next();
    } else if (tools.inArrayMatch(ignore, req.path)) {
      next();
    } else if (!tools.isNotObj(userInfo)) {
      next();
    } else {
      authService.checkAutoLogin(req, function (userInfo) {
        next();
      }, function () {
        var error = new Error("no login");
        error.status = 401;
        delete error.stack;
        if (req.xhr) {
          next(error);
        } else {
          res.redirect(301, '/#!/login');
          next(error);
        }
      })
    }
  }
};
