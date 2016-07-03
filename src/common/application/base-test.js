import BaseApplication from './base';
import CallbackDispatcher from 'common/dispatchers/callback';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    BaseApplication.create();
  });

  it('can be created with properties', function() {
    var app = BaseApplication.create({ a: 'b' });
    expect(app.a).to.be('b');
  });

  it('is observable', function() {
    var app = BaseApplication.create({ a: 'b'});
    expect(app.observe).not.to.be(void 0);
  });

  it('properly initializes the application', async function() {
    var app = BaseApplication.create();
    var events = [];
    app.bus.observe(CallbackDispatcher.create((event) => events.push(event)))
    await app.initialize();
    expect(events.length).to.be(2);
    expect(events[0].target).to.be(app);
    expect(events[0].type).to.be('load');
    expect(events[1].type).to.be('initialize');
  });

  it('cannot initialize the application twice', async function() {
    var app = BaseApplication.create();
    await app.initialize();
    var err;
    try {
      await app.initialize();
    } catch(e) { err = e; }
    expect(err).not.to.be(void 0);
  });
})
