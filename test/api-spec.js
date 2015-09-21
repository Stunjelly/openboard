var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var db = require('../models');
var should = chai.should();

chai.use(chaiHttp);

// Default DB Tables
var tables = {
  dashboards: [
    {userId: 'testuser', title: 'Dashboard 1'},
    {userId: 'testuser', title: 'Dashboard 2'},
    {userId: 'not_testuser', title: 'Dashboard 3'},
    {userId: 'not_testuser', title: 'Dashboard 4', 'public': true}
  ],
  widgets: [{
    dashboardId: 1, title: 'Widget 1', method: 'polling', url: 'http://example.com',
    cache: {"item": [{"value": 1999}, [477, 487, 372, 324, 339]]},
    config: {}
  }, {
    dashboardId: 1, title: 'Widget 2', method: 'polling', url: 'http://example.com',
    cache: {"item": [{"value": 1999}, [477, 487, 372, 324, 339]]},
    config: {}
  }, {
    dashboardId: 3, title: 'Widget 1', method: 'polling', url: 'http://example.com',
    cache: {"item": [{"value": 1999}, [477, 487, 372, 324, 339]]},
    config: {}
  }, {
    dashboardId: 3, title: 'Widget 2', method: 'polling', url: 'http://example.com',
    cache: {"item": [{"value": 1999}, [477, 487, 372, 324, 339]]},
    config: {}
  }]
};

describe('API', function () {

  // Setup database default data
  beforeEach(function (done) {
    db.sequelize.sync()
      .then(function () {
        return db.Dashboard.bulkCreate(tables.dashboards);
      })
      .then(function () {
        return db.Widget.bulkCreate(tables.widgets);
      })
      .then(function () {
        done();
      });
  });

  // Truncate tables
  afterEach(function (done) {
    db.sequelize.transaction(function (t) {
      var options = {raw: true, transaction: t};

      return db.sequelize
        .query('SET FOREIGN_KEY_CHECKS = 0', options)
        .then(function () {
          return db.sequelize.query('truncate table dashboards', options)
        })
        .then(function () {
          return db.sequelize.query('truncate table widgets', options)
        })
        .then(function () {
          return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
        })
    }).then(function () {
      done();
    })
  });

  /**
   * Dashboard API Tests
   */
  describe('Dashboards', function () {

    var testDashboard = {
      title: 'New Dashboard',
      userId: 'not_testuser'
    };

    describe('GET /api/dashboards', function () {
      it('should list ALL my dashboards', function (done) {
        chai.request(server)
          .get('/api/dashboards')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });
    });

    describe('GET /api/dashboards/:id', function () {
      it('should return a SINGLE dashboard', function (done) {
        chai.request(server)
          .get('/api/dashboards/1')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id').equal(1);
            res.body.should.have.property('title').be.a('string');
            res.body.should.have.property('userId').equal('testuser');
            res.body.should.have.property('public').be.a('boolean');
            res.body.should.have.property('customStyle');
            res.body.should.have.property('createdAt').be.a('string');
            res.body.should.have.property('updatedAt').be.a('string');
            done();
          });
      });
      it('should return 403 Forbidden when trying to get another users dashboard', function (done) {
        chai.request(server)
          .get('/api/dashboards/3')
          .end(function (err, res) {
            res.should.have.status(403);
            done();
          });
      });
      it('should return 404 Not Found for a unknown id', function (done) {
        chai.request(server)
          .get('/api/dashboards/99999')
          .end(function (err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe('POST /api/dashboards', function () {
      it('should add a SINGLE dashboard', function (done) {
        chai.request(server)
          .post('/api/dashboards')
          .send(testDashboard)
          .end(function (err, res) {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('title').be.a('string').equal(testDashboard.title);

            // API should not be able to set the userId
            res.body.should.have.property('userId').be.a('string').equal('testuser');

            // Make sure defaults are correct
            res.body.should.have.property('public').be.a('boolean').equal(false);
            res.body.should.have.property('theme').be.a('string').equal('dark');

            // dashboards should have timestamps
            res.body.should.have.property('createdAt').be.a('string');
            res.body.should.have.property('updatedAt').be.a('string');
            testDashboard = res.body;
            done();
          });
      });
    });

    describe('POST /api/dashboards/:id', function () {
      it('should update a SINGLE dashboard', function (done) {
        var dashboardTitle = 'Dashboard 1 Updated';
        chai.request(server)
          .post('/api/dashboards/1')
          .send({
            title: dashboardTitle,
            theme: 'default',
            columns: 6,
            customStyle: 'body{background-color:yellow"}'
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').be.a('string').equal(dashboardTitle);
            testDashboard = res.body;
            done();
          });
      });
    });

    describe('DELETE /api/dashboards/:dashboardId', function () {
      it('should return 304 and delete a SINGLE dashboard', function (done) {
        chai.request(server)
          .delete('/api/dashboards/1')
          .end(function (err, res) {
            res.should.have.status(204);
            // TODO: test to see if it's removing the dashboard from the DB table
            done();
          });
      });
      it('should return 403 if trying to delete someone else\s dashboard', function (done) {
        chai.request(server)
          .delete('/api/dashboards/3')
          .end(function (err, res) {
            res.should.have.status(403);
            done();
          });
      });
      it('should return 404 if trying to delete unknown dashboard', function (done) {
        chai.request(server)
          .delete('/api/dashboards/999')
          .end(function (err, res) {
            res.should.have.status(404);
            done();
          });
      });
    });

  });

  /**
   * Widget API Tests
   */
  describe('Widgets', function () {

    describe('GET /api/dashboards/:dashboardId/widgets', function () {

      it('should return a list of widgets for a dashboard', function (done) {
        chai.request(server)
          .get('/api/dashboards/1/widgets')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });

      it('should return 403 Forbidden when trying to get another users widgets', function (done) {
        chai.request(server)
          .get('/api/dashboards/3/widgets')
          .end(function (err, res) {
            res.should.have.status(403);
            done();
          });
      });

      it('should return 404 for an unknown dashboard', function (done) {
        chai.request(server)
          .get('/api/dashboards/999/widgets')
          .end(function (err, res) {
            res.should.have.status(404);
            done();
          });
      });

    });

    describe('POST /api/dashboards/:dashboardId/widgets', function () {
      var newWidget = {
        "typeId": 1,
        "title": "Weekly Users",
        "method": "polling", "reload": 600,
        "cache": {"item": [{"value": 1928}, [487, 372, 324, 339, 406]]},
        "url": "https://csgoloot.com/api/geckoboard/number/users?days=5"
      };

      it('should create a new widget', function (done) {
        chai.request(server)
          .post('/api/dashboards/1/widgets')
          .send(newWidget)
          .end(function (err, res) {
            console.log(res.body); // fs travis...
            console.log(res);
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.not.have.property('cache');
            res.body.should.have.property('title').be.a('string').equal(newWidget.title);
            res.body.should.have.property('x').be.a('number').equal(0);
            res.body.should.have.property('y').be.a('number').equal(0);
            res.body.should.have.property('w').be.a('number').equal(1);
            res.body.should.have.property('h').be.a('number').equal(1);
            res.body.should.have.property('createdAt').be.a('string');
            res.body.should.have.property('updatedAt').be.a('string');
            done();
          });
      });

      it('should not be allowed to create a widget on someone else\'s dashboard', function (done) {
        chai.request(server)
          .post('/api/dashboards/3/widgets')
          .send(newWidget)
          .end(function (err, res) {
            res.should.have.status(403);
            done();
          });
      });

    });

    describe('POST /api/dashboards/:dashboardId/widgets/:widgetId', function () {

      var updateWidget = {title: 'New Widget Title', x: 270};

      it('should update a current widget', function (done) {
        chai.request(server)
          .post('/api/dashboards/1/widgets/1')
          .send(updateWidget)
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.title.should.equal(updateWidget.title);
            res.body.x.should.equal(updateWidget.x);
            done();
          });
      });

      it('should return 404 Not Found on an unknown widget', function (done) {
        chai.request(server)
          .post('/api/dashboards/1/widgets/999')
          .send(updateWidget)
          .end(function (err, res) {
            res.should.have.status(404);
            done();
          });
      });

      it('should return 403 on someone else\'s widget', function (done) {
        chai.request(server)
          .post('/api/dashboards/3/widgets/3')
          .send(updateWidget)
          .end(function (err, res) {
            res.should.have.status(403);
            done();
          });
      });

    });

  });

  /**
   * Widget Types API Tests
   */
  describe('Widget Types', function () {

  });
});
