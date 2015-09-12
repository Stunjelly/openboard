var dashboards = require('./dashboards');
var widgets = require('./widgets');

exports = module.exports = function (app) {

  app.get('/openboard/dashboards', dashboards.findAll);
  app.get('/openboard/dashboards/:id', dashboards.find);
  app.post('/openboard/dashboards', dashboards.create);
  app.put('/openboard/dashboards/:id', dashboards.update);
  app.del('/openboard/dashboards/:id', dashboards.destroy);

  app.get('/openboard/widgets', widgets.findAll);
  app.get('/openboard/widgets/:id', widgets.find);
  app.post('/openboard/widgets', widgets.create);
  app.put('/openboard/widgets/:id', widgets.update);
  app.del('/openboard/widgets/:id', widgets.destroy);

  app.get('/openboard/me', function (req, res) {
    console.log(req.ntlm);
    res.send(req.ntlm);
  });

};
