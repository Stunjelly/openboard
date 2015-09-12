module.exports = function(sequelize, DataTypes) {
  var Widget = sequelize.define('Widget', {
    dashboardId: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notNull: false,
        len: [0, 100]
      }
    },
    width: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        min: 1,
        max: 6
      }
    },
    height: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        min: 1,
        max: 6
      }
    },
    apiKey: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        len: [0, 36]
      }
    },
    method: {
      type: DataTypes.ENUM('push', 'polling'),
      validate: {
        notNull: true
      }
    },
    type: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        min: 1,
        max: 20
      }
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        notNull: false
      }
    },
    urlKey: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        len: [0, 36]
      }
    }
  });

  return Widget
};
