var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var Dashboard = sequelize.define('Dashboard', {
  userId: {type: Sequelize.STRING, allowNull: false, len: [0, 40]},
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 40]},
  'public': {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
  columns: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 3, len: [3, 6]}
});

/**
 * Widget
 * @type {Model}
 */
var Widget = sequelize.define('Widget', {
  dashboardId: {type: Sequelize.INTEGER, allowNull: false},
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 100]},
  w: {type: Sequelize.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
  h: {type: Sequelize.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
  x: {type: Sequelize.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
  y: {type: Sequelize.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
  apiKey: {type: Sequelize.STRING, allowNull: true, len: [0, 36], defaultValue: 'mykey'},
  method: {type: Sequelize.ENUM('push', 'polling'), allowNull: false},
  type: {type: Sequelize.INTEGER, allowNull: false, min: 1, max: 20},
  interval: {type: Sequelize.INTEGER, allowNull: false, min: 30, max: 7200, defaultValue: 300},
  url: {type: Sequelize.STRING, allowNull: true},
  urlKey: {type: Sequelize.STRING, allowNull: true, len: [0, 36]},
  cache: JsonField(sequelize, 'Widget', 'cache'),
  config: JsonField(sequelize, 'Widget', 'config')
});

/**
 * Widget Type
 * This model has the front end schema and forms for updating the widget config
 * @type {Model}
 */
var Type = sequelize.define('Type', {
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 100]},
  schema: JsonField(sequelize, 'Type', 'schema'),
  form: JsonField(sequelize, 'Type', 'form'),
  model: JsonField(sequelize, 'Type', 'model')
});

//Widget.belongsTo(Dashboard);

module.exports = {
  Dashboard: Dashboard,
  Widget: Widget,
  Type: Type,
  sequelize: sequelize,
  Sequelize: Sequelize
};
