var db = require('../models');

exports.findAll = function (req, res) {
  db.Type.findAll().then(function (entities) {
    return res.json(entities);
  }, function (err) {
    return res.send(400, err);
  })
};

exports.find = function (req, res) {
  var q = req.param('field') ? db.Type.find({
    where: {id: req.param('typeId')},
    attributes: req.param('field').split(',')
  }) : db.Type.findById(req.param('typeId'));
  q.then(function (entity) {
    return entity ? res.json(entity) : res.send(404);
  }, function (err) {
    return res.send(400, err);
  })
};

// TODO: limit this to an admin :)
exports.update = function (req, res) {
  db.Type.findById(req.param('typeId')).then(function (entity) {
    if (!entity) return res.send(404);
    entity.updateAttributes(req.body).then(function (entity) {
      return res.json(entity);
    });
  }, function (err) {
    return res.send(400, err);
  })
};
