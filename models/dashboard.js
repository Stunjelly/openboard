module.exports = function (sequelize, DataTypes) {
  var Dashboard = sequelize.define('Dashboard', {
    userId: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        len: [0, 40]
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        len: [0, 40]
      }
    },
    'public': {
      type: DataTypes.BOOLEAN,
      validate: {
        notNull: true,
        defaultValue: false
      }
    },
    columns: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        len: [3, 6],
        defaultValue: 3
      }
    }
  });

  return Dashboard
};
