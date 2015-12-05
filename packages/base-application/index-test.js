import BaseApplication from './index';
import BaseObject from 'base-object';
import { Entry } from 'registry';
import sift from 'sift';
import { CallbackNotifier, AcceptNotifier } from 'notifiers';
import { LOAD, INITIALIZE } from 'notifier-messages';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be created', function() {
    BaseApplication.create();
  });

  it('can register a new plugin', function() {
    var a = BaseApplication.create();
    a.usePlugin(BaseObject);
    expect(a.plugins.length).to.be(1);
    expect(a.plugins[0].application).to.be(a);
  });

  it('pulls plugins from static prop', function() {
    class SubApplication extends BaseApplication {
      static plugins = [BaseObject, BaseObject];
    }
    var a = SubApplication.create();
    expect(a.plugins.length).to.be(2);
    expect(a.plugins[0].application).to.be(a);
  });

  it('waits for load message to complete before calling initialize', async function() {
    var app = BaseApplication.create();

    var loadCount = 0;
    var initCount = 0;

    app.notifier.push(AcceptNotifier.create(sift({ type: LOAD }), CallbackNotifier.create(function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          loadCount++;
          resolve();
        }, 2);
      })
    })));

    app.notifier.push(AcceptNotifier.create(sift({ type: INITIALIZE }), CallbackNotifier.create(function() {
      expect(loadCount).to.be(1);
      initCount++;
    })));

    await app.initialize();
    expect(initCount).to.be(1);
  });
});
