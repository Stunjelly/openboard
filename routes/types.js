var db = require('../models');

exports.findAll = function (req, res) {
  db.Type.findAll().then(function (entities) {
    res.json(entities)
  }, function (err) {
    res.send(400, err);
  })
};

exports.find = function (req, res) {
  var query = {
    where: {
      id: req.param('typeId')
    }
  };
  if (req.param('field')) {
    query.attributes = req.param('field').split(',');
  }
  db.Type.find(query).then(function (entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  }, function (err) {
    res.send(400, err);
  })
};

exports.update = function (req, res) {
  db.Type.find({
    where: {
      id: req.param('typeId')
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
