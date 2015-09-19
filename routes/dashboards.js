var db = require('../models');
var _ = require('lodash');
var async = require('async');

var allowedKeys = ['title', 'public', 'theme', 'customStyle', 'columns'];

exports.findAll = function (req, res) {
  db.Dashboard.findAll({
    where: {userId: req.ntlm.UserName},
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(function (entities) {
    res.json(entities)
  }, function (err) {
    res.send(500)
  })
};

exports.find = function (req, res) {
  db.Dashboard.findById(req.param('dashboardId')).then(function (entity) {
    if (entity) {
      if (entity.userId !== req.ntlm.UserName) {
        return res.send(403)
      }
      res.json(entity)
    } else {
      res.send(404)
    }
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
  var query = {
    where: {
      id: req.param('dashboardId'),
      userId: req.ntlm.UserName
    }
  };
  db.Dashboard.find(query).then(function (entity) {
    if (entity) {
      var update = _.pick(req.body, allowedKeys);
      entity.updateAttributes(update).then(function (entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  });
};

exports.destroy = function (req, res) {
  db.Dashboard.find({
    where: {
      id: req.param('dashboardId')
    }
  }).then(function (entity) {
    if (entity) {
      if (entity.userId !== req.ntlm.UserName) {
        return res.send(403)
      }
      entity.destroy().then(function () {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  });
};
