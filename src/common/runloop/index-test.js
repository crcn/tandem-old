import Runloop from './index';

describe(__filename + '#', function () {
  it('can be created', function () {
    Runloop.create();
  });

  it('can push something to update', function () {
    var rl = Runloop.create();
    var i = 0;
    rl.deferOnce({ update() { i++; } });
    expect(i).to.be(0);
    rl.runNow();
    expect(i).to.be(1);
  });
});
