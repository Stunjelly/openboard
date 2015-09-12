module.exports = function (sequelize, DataTypes) {

  var Widget = sequelize.define('Widget', {
    dashboardId: {type: DataTypes.INTEGER, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false, len: [0, 100]},
    width: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 6},
    height: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 6},
    apiKey: {type: DataTypes.STRING, allowNull: false, len: [0, 36]},
    method: {type: DataTypes.ENUM('push', 'polling'), allowNull: false},
    type: {type: DataTypes.INTEGER, allowNull: false, min: 1, max: 20},
    url: {type: DataTypes.STRING, allowNull: true},
    urlKey: {type: DataTypes.STRING, allowNull: true, len: [0, 36]}
  });

  return Widget
};
