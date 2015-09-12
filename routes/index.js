var dashboards = require('./dashboards');
var widgets = require('./widgets');

exports = module.exports = function (app) {

  app.get('/api/dashboards', dashboards.findAll);
  app.get('/api/dashboards/:id', dashboards.find);
  app.post('/api/dashboards', dashboards.create);
  app.put('/api/dashboards/:id', dashboards.update);
  app.del('/api/dashboards/:id', dashboards.destroy);

  app.get('/api/widgets', widgets.findAll);
  app.get('/api/widgets/:id', widgets.find);
  app.post('/api/widgets', widgets.create);
  app.put('/api/widgets/:id', widgets.update);
  app.del('/api/widgets/:id', widgets.destroy);

  app.get('/api/me', function (req, res) {
    console.log(req.ntlm);
    res.send(req.ntlm);
  });

};
