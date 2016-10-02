/* eslint no-underscore-dangle: 0, consistent-return: 0 */
const assert = require('assert');
const boom = require('boom');
const errorHandler = require('../../middleware/errorHandler');
const EventEmitter = require('events').EventEmitter;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

describe('errorHandler middleware', () => {
  it('should set status code and some info from \'boom\' error', (done) => {
    const message = 'something is wrong';
    const err = boom.badRequest(message);
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });
    const next = sinon.spy();

    res.on('end', () => {
      const body = JSON.parse(res._getData());

      assert(!next.called);
      assert.equal(res.statusCode, 400);
      assert.equal(body.message, message);

      done();
    });

    errorHandler(err, req, res, next);
  });

  it('should set status code 500 for unknown error', (done) => {
    const message = 'something bad';
    const err = new Error(message);
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });
    const next = sinon.spy();

    res.on('end', () => {
      assert(!next.called);
      assert.equal(res.statusCode, 500);

      done();
    });

    errorHandler(err, req, res, next);
  });
});
