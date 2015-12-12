import BaseApplication from './app';
import BaseObject from 'common/object/base';
import { Plugin } from 'common/registry';
import sift from 'sift';
import { CallbackNotifier, AcceptNotifier } from 'common/notifiers';
import { LOAD, INITIALIZE } from 'base/messages';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be created', function() {
    BaseApplication.create();
  });

  it('pulls plugins from static prop', function() {

    var fakeFactory = {
      create({ app }) {

      }
    };

    class SubApplication extends BaseApplication {
      static plugins = [
        Plugin.create({ id: 'plugin', type: 'application', factory: fakeFactory }),
        Plugin.create({ id: 'plugin2', type: 'application', factory: fakeFactory })
      ];
    }
    var a = SubApplication.create();
    expect(a.plugins.length).to.be(2);
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
