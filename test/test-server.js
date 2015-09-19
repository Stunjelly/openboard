var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('API', function () {
  describe('Dashboards', function () {
    it('should list ALL dashboards on /api/dashboards GET', function (done) {
      chai.request(server)
        .get('/api/dashboards')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
    it('should list a SINGLE dashboard on /api/dashboards/:id GET');
    it('should add a SINGLE dashboard on /api/dashboards POST');
    it('should update a SINGLE dashboard on /api/dashboards/:id PUT');
    it('should delete a SINGLE dashboard on /api/dashboards/:id DELETE');
  });
});
