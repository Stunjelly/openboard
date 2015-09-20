var db = require('../models');
var crypto = require('crypto');
var _ = require('lodash');

var allowedKeys = ['title', 'w', 'h', 'x', 'y', 'method', 'reload', 'url', 'urlKey', 'config'];

exports.findAll = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId'), {attributes: ['id', 'userId']}).then(function (dashboard) {
    if (!dashboard) return res.send(404);
    if (dashboard.userId !== req.ntlm.UserName) return res.send(403);
    db.Widget.findAll({where: {dashboardId: dashboard.id}}).then(function (entities) {
      return res.json(entities)
    }, function (err) {
      return res.send(400, err);
    });
  });
};

exports.find = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId'), {attributes: ['id', 'userId']}).then(function (dashboard) {
    if (!dashboard) return res.send(404);
    if (dashboard.public !== true && dashboard.userId !== req.ntlm.UserName) return res.send(403);
    db.Widget.find({where: {id: req.param('widgetId'), dashboardId: dashboard.id}}).then(function (entity) {
      return !entity ? res.json(entity) : res.send(404);
    }, function (err) {
      return res.send(400, err);
    })
  });
};

exports.create = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId'), {attributes: ['id', 'userId']}).then(function (dashboard) {
    if (!dashboard) return res.send(404);
    if (dashboard.userId !== req.ntlm.UserName) return res.send(403);
    var createBody = _.pick(req.body, allowedKeys);
    createBody.dashboardId = dashboard.id;
    db.Widget.create(createBody).then(function (entity) {
      res.statusCode = 201;
      return res.json(entity);
    }, function (err) {
      return res.send(400, err);
    });
  });
};

exports.update = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId'), {attributes: ['id', 'userId']}).then(function (dashboard) {
    if (!dashboard) return res.send(404);
    if (dashboard.userId !== req.ntlm.UserName) return res.send(403);
    db.Widget.find({where: {id: req.param('widgetId'), dashboardId: dashboard.id}}).then(function (entity) {
      if (!entity) return res.send(404);
      var update = _.pick(req.body, allowedKeys);
      update.dashboardId = req.param('dashboardId');
      entity.updateAttributes(update).then(function (entity) {
        return res.json(entity);
      }, function (err) {
        return res.send(400, err);
      });
    });
  });
};

exports.destroy = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId'), {attributes: ['id', 'userId']}).then(function (dashboard) {
    if (!dashboard) return res.send(404);
    if (dashboard.userId !== req.ntlm.UserName) return res.send(403);
    db.Widget.find({where: {id: req.param('widgetId'), dashboardId: dashboard.id}}).then(function (entity) {
      if (!entity) return res.send(404);
      entity.destroy().then(function () {
        return res.send(204);
      }, function (err) {
        return res.send(400, err);
      });
    });
  });
};

exports.updateClient = function (req, res) {
  var expected = crypto.createHash('md5').update(req.param('dashboardId') + process.env.USER_API_SECRET).digest("hex");
  res.send(expected, expected === req.body.apikey);
};

function checkApiKey(username, actual) {
  var expected = crypto.createHash('md5').update(username + process.env.USER_API_SECRET).digest("hex");
  console.log(expected, actual);
  return expected === actual;
}
