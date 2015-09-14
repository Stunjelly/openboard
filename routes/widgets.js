var db = require('../models');

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
  db.Widget.create(req.body).then(function (entity) {
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
      entity.updateAttributes(req.body).then(function (entity) {
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
