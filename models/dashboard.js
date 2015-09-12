module.exports = function (sequelize, DataTypes) {

  var Dashboard = sequelize.define('Dashboard', {
    userId: {type: DataTypes.STRING, allowNull: false, len: [0, 40]},
    title: {type: DataTypes.STRING, allowNull: false, len: [0, 40]},
    'public': {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    columns: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 3, len: [3, 6]}
  });

  return Dashboard
};
