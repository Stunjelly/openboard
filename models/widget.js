var JsonField = require('sequelize-json');

module.exports = function (sequelize, DataTypes) {

  var Widget = sequelize.define('Widget', {
    dashboardId: {type: DataTypes.INTEGER, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false, len: [0, 100]},
    w: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
    h: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
    x: {type: DataTypes.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
    y: {type: DataTypes.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
    apiKey: {type: DataTypes.STRING, allowNull: false, len: [0, 36]},
    method: {type: DataTypes.ENUM('push', 'polling'), allowNull: false},
    type: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 20},
    url: {type: DataTypes.STRING, allowNull: true},
    urlKey: {type: DataTypes.STRING, allowNull: true, len: [0, 36]},
    cache: JsonField(sequelize, 'Widget', 'cache'),
    config: JsonField(sequelize, 'Widget', 'config')
  });

  return Widget
};
