var JsonField = require('sequelize-json');

module.exports = function (sequelize, DataTypes) {

  var Type = sequelize.define('Type', {
    title: {type: DataTypes.STRING, allowNull: false, len: [0, 100]},
    schema: JsonField(sequelize, 'Type', 'schema'),
    form: JsonField(sequelize, 'Type', 'form'),
    model: JsonField(sequelize, 'Type', 'model')
  });

  return Type
};
