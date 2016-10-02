/* eslint consistent-return: 0 */
const assert = require('assert');
const sinon = require('sinon');

const error404 = require('../../middleware/error404');

describe('error404 middleware', () => {
  it('should call \'next\' with instance of \'boom\' error', () => {
    const next = sinon.spy();
    error404({}, {}, next);

    assert(next.calledOnce);
    assert(next.args[0][0] instanceof Error);
    assert(next.args[0][0].isBoom);
  });
});
