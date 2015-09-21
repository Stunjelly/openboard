var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.warn : false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

/**
 * Dashboard Model
 * @type {Model}
 */
var Dashboard = sequelize.define('dashboard', {
  userId: {type: Sequelize.STRING, allowNull: false, len: [0, 40]},
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 40]},
  'public': {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
  theme: {type: Sequelize.STRING, allowNull: true, len: [3, 36], defaultValue: 'dark'},
  customStyle: {type: Sequelize.TEXT, allowNull: true},
  columns: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 3, len: [3, 6]}
});

/**
 * Widget Model
 * @type {Model}
 */
var Widget = sequelize.define('widget', {
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 100]},
  w: {type: Sequelize.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
  h: {type: Sequelize.INTEGER, allowNull: false, min: 1, max: 6, defaultValue: 1},
  x: {type: Sequelize.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
  y: {type: Sequelize.INTEGER, allowNull: false, min: 0, max: 6, defaultValue: 0},
  method: {type: Sequelize.ENUM('push', 'polling'), allowNull: false},
  reload: {type: Sequelize.INTEGER, allowNull: true, min: 30, max: 7200, defaultValue: 300},
  url: {type: Sequelize.STRING, allowNull: true},
  urlKey: {type: Sequelize.STRING, allowNull: true, len: [0, 36]},
  apiKey: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4},
  cache: JsonField(sequelize, 'widget', 'cache'),
  config: JsonField(sequelize, 'widget', 'config')
});

/**
 * Widget Type Model
 * This model has the front end schema and forms for updating the widget config
 * @type {Model}
 */
var Type = sequelize.define('type', {
  title: {type: Sequelize.STRING, allowNull: false, len: [0, 100]},
  fields: JsonField(sequelize, 'type', 'fields'),
  form: JsonField(sequelize, 'type', 'form'),
  model: JsonField(sequelize, 'type', 'model')
});

/**
 * Setup Relationships
 */
Widget.belongsTo(Dashboard);
Widget.belongsTo(Type);

/**
 * Here we create our default Widget Types, these should move to ./widgets dir as they will pack out quite a bit
 */
Type.bulkCreate([
  {id: 1, title: "Number and Secondary Stat", schema: {}, form: {}, model: {"goal": 0}},
  {id: 2, title: "Line Chart", schema: {}, form: {}, model: {}},
  {id: 3, title: "Bar/Column Chart", schema: {}, form: {}, model: {}},
  {id: 4, title: "Geck-o-Meter", schema: {}, form: {}, model: {}},
  {id: 5, title: "Leaderboard", schema: {}, form: {}, model: {}},
  {id: 6, title: "Text", schema: {}, form: {}, model: {}},
  {id: 7, title: "Mapping", schema: {}, form: {}, model: {}},
  {id: 8, title: "Funnel", schema: {}, form: {}, model: {}},
  {id: 9, title: "Bullet Graph", schema: {}, form: {}, model: {}},
  {id: 10, title: "Monitoring", schema: {}, form: {}, model: {}},
  {id: 11, title: "List", schema: {}, form: {}, model: {}},
  {id: 12, title: "Highcharts Chart", schema: {}, form: {}, model: {}},
  {id: 13, title: "RAG Numbers and RAG Column & Numbers", schema: {}, form: {}, model: {}},
  {id: 14, title: "Pie Chart", schema: {}, form: {}, model: {}}
]).catch(function (errors) {
  // There will be errors!
});

module.exports = {
  Dashboard: Dashboard,
  Widget: Widget,
  Type: Type,
  sequelize: sequelize,
  Sequelize: Sequelize
};
