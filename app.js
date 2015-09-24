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
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? null : 'dev'));
}
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, process.env.NODE_ENV === 'development' ? 'public' : 'public/_dist')));

// development only
if (process.env.NODE_ENV === 'production') {
  app.use(ntlm({domain: process.env.LDAP_DOMAIN, domaincontroller: process.env.LDAP_CONTROLLLER}));
} else {
  app.use(errorHandler());
  app.use(function (req, res, next) {
    req.ntlm = {
      "DomainName": "national",
      "UserName": "testuser",
      "Workstation": "stunjelly"
    };
    next();
  });
}

require('./routes')(app);

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Openboard listening on port ' + app.get('port'));
});

// Sockets
io = require('socket.io').listen(server);
require('./sockets.js')(io, app);

module.exports = app;
