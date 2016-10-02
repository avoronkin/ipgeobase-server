/* eslint no-underscore-dangle: 0, consistent-return: 0 */
const assert = require('assert');
const httpMocks = require('node-mocks-http');
const version = require('../../middleware/version');

describe('version middleware', () => {
  it('should call next() if version matches', (done) => {
    const middleware = version();
    const req = httpMocks.createRequest({
      meta: {
        version: '4',
      },
      query: {
        version: '4',
      },
    });
    const res = httpMocks.createResponse();

    middleware(req, res, (err) => {
      if (err) {
        if (err instanceof Error) return done(err);
      }

      assert.notEqual(err, 'router');
      done();
    });
  });

  it('should call next(\'route\') if version doesn\'t match', (done) => {
    const middleware = version();
    const req = httpMocks.createRequest({
      meta: {
        version: '4',
      },
      query: {
        version: '5',
      },
    });
    const res = httpMocks.createResponse();

    middleware(req, res, (err) => {
      if (err && err instanceof Error) return done(err);

      assert.equal(err, 'router');
      done();
    });
  });
});
