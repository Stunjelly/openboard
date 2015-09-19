var db = require('../models');
var crypto = require('crypto');
var _ = require('lodash');

var allowedKeys = ['title', 'w', 'h', 'x', 'y', 'method', 'reload', 'url', 'urlKey', 'config'];

exports.findAll = function (req, res) {
  db.Widget.findAll({where: {dashboardId: req.param('dashboardId')}}).then(function (entities) {
    res.json(entities)
  }, function (err) {
    res.send(400, err);
  })
};

exports.find = function (req, res) {
  db.Widget.find({
    where: {
      id: req.param('widgetId'),
      dashboardId: req.param('dashboardId')
    }
  }).then(function (entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  }, function (err) {
    res.send(400, err);
  })
};

exports.create = function (req, res) {
  var createBody = _.pick(req.body, allowedKeys);
  db.Widget.create(createBody).then(function (entity) {
    res.statusCode = 201;
    res.json(entity)
  }, function (err) {
    res.send(400, err);
  })
};

exports.update = function (req, res) {
  db.Widget.find({
    where: {
      id: req.param('widgetId'),
      dashboardId: req.param('dashboardId')
    }
  }).then(function (entity) {
    if (entity) {
      var update = _.pick(req.body, allowedKeys);
      entity.updateAttributes(update).then(function (entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  }, function (err) {
    res.send(400, err);
  })
};

exports.destroy = function (req, res) {
  db.Widget.find({
    where: {
      id: req.param('widgetId'),
      dashboardId: req.param('dashboardId')
    }
  }).then(function (entity) {
    if (entity) {
      entity.destroy().then(function () {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  }, function (err) {
    res.send(400, err);
  })
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
