/* eslint consistent-return: 0 */
const assert = require('assert');
const httpMocks = require('node-mocks-http');
const queryParser = require('../../middleware/queryParser');

describe('queryParser middleware', () => {
  it('should parse query', (done) => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/url?test=55',
    });
    const res = httpMocks.createResponse();

    queryParser(req, res, (err) => {
      if (err) return done(err);

      assert(req.query && req.query.test);
      assert.equal(req.query.test, '55');

      done();
    });
  });
});
