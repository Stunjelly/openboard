var db = require('../models');
var async = require('async');

exports.findAll = function (req, res) {
  db.Dashboard.findAll({
    where: {userId: req.ntlm.UserName},
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(function (entities) {
    res.json(entities)
  })
};

exports.find = function (req, res) {
  db.Dashboard.find({
    where: {
      id: req.param('dashboardId'),
      userId: req.ntlm.UserName
    }
  }).then(function (entity) {
    if (entity) {
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
  db.Dashboard.find({
    where: {
      id: req.param('dashboardId'),
      userId: req.ntlm.UserName
    }
  }).then(function (entity) {
    if (entity) {
      entity.updateAttributes({
        title: req.body.title,
        'public': req.body.public
      }).then(function (entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  })
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
