var db = require('../models');
var _ = require('lodash');
var async = require('async');

var allowedKeys = ['title', 'public', 'theme', 'customStyle', 'columns'];

exports.findAll = function (req, res) {
  var q = req.query.public === '1' ? {where: {public: true}} : {where: {userId: req.ntlm.UserName}};
  db.Dashboard.findAll(q).then(function (entities) {
    return res.json(entities);
  }, function (err) {
    return res.send(500, err);
  })
};

exports.find = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId')).then(function (entity) {
    if (!entity) return res.send(404);
    if (entity.public !== true && entity.userId !== req.ntlm.UserName) return res.send(403);
    return res.json(entity);
  })
};

exports.create = function (req, res) {
  db.Dashboard.create({
    userId: req.ntlm.UserName,
    title: req.body.title,
    'public': req.body.public === 'true' ? 1 : 0
  }).then(function (entity) {
    res.statusCode = 201;
    res.json(entity)
  }, function (err) {
    res.send(400, err);
  })
};

exports.update = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId')).then(function (entity) {
    if (!entity) return res.send(404);
    if (entity.userId !== req.ntlm.UserName) return res.send(403);
    var update = _.pick(req.body, allowedKeys);
    entity.updateAttributes(update).then(function (entity) {
      res.json(entity)
    })
  });
};

exports.destroy = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId')).then(function (entity) {
    if (!entity) return res.send(404);
    if (entity.userId !== req.ntlm.UserName) return res.send(403);
    entity.destroy().then(function () {
      return res.send(204);
    }, function (err) {
      return res.send(500, err);
    })
  });
};
