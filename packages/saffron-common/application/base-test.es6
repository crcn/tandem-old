import BaseApplication from './base';
import expect from 'expect.js';

describe(__filename + '#', function () {
  it('can be created', function () {
    BaseApplication.create();
  });

  it('can be created with properties', function () {
    var app = BaseApplication.create({ a: 'b' });
    expect(app.a).to.be('b');
  });

  it('cannot initialize the application twice', async function () {
    const app = BaseApplication.create();
    await app.initialize();
    let err;
    try {
      await app.initialize();
    } catch (e) { err = e; }
    expect(err).not.to.be(void 0);
  });
});
