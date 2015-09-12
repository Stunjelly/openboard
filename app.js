require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var ntlm = require('express-ntlm');
var db = require('./models');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, process.env.NODE_ENV === 'development' ? 'public' : 'public/_dist')));

// development only
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
  app.use(function (req, res, next) {
    req.ntlm = {"DomainName": "national", "UserName": process.env.DEV_USERNAME || "testUser", "Workstation": "stunjelly"};
    next();
  });
} else {
  app.use(ntlm({domain: process.env.LDAP_DOMAIN, domaincontroller: process.env.LDAP_CONTROLLLER}));
}

require('./routes')(app);

db.sequelize.sync().complete(function (err) {
  if (err) {
    throw err
  } else {
    http.createServer(app).listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port'))
    })
  }
});
