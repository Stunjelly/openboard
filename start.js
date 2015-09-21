if (process.env.NODE_ENV !== 'test') {
  require('dotenv').load();
}

var db = require('./models');

db.sequelize.sync().then(function() {
  require('./app.js');
});
