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
    {userId: 'not_testuser', title: 'Dashboard 3'}
  ],
  widgets: [{
    dashboardId: 1, title: 'Widget 1', method: 'polling', url: 'http://example.com',
    cache: {"item": [{"value": 1999}, [477, 487, 372, 324, 339]]},
    config: {}
  }]
};

describe('API', function () {

  // Setup database default data
  beforeEach(function (done) {
    db.sequelize.sync()
      .then(function() {
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
      title: 'New Dashboard'
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

    it('POST /api/dashboards should add a SINGLE dashboard', function (done) {
      chai.request(server)
        .post('/api/dashboards')
        .send(testDashboard)
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title').be.a('string').equal(testDashboard.title);
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

    it('POST /api/dashboards/:dashboardId should update a SINGLE dashboard', function (done) {
      var dashboardTitle = 'Dashboard 1 Updated';
      // Waiting 1 second so that createdAt and updatedAt timestamps are different
      setTimeout(function () {
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
            res.body.updatedAt.should.not.equal(res.body.createdAt);
            testDashboard = res.body;
            done();
          });
      }, 1000);
    });

    it('DELETE /api/dashboards/:dashboardId should delete a SINGLE dashboard', function (done) {
      chai.request(server)
        .delete('/api/dashboards/1')
        .end(function (err, res) {
          res.should.have.status(204);
          done();
        });
    });

  });

  /**
   * Widget API Tests
   */
  describe('Widgets', function () {

  });


  /**
   * Widget Types API Tests
   */
  describe('Widget Types', function () {

  });
});
