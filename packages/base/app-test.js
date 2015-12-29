import BaseApplication from './app';
import BaseObject from 'common/object/base';
import { Fragment } from 'common/registry';
import sift from 'sift';
import { CallbackNotifier, AcceptNotifier } from 'common/notifiers';
import { LOAD, INITIALIZE } from 'base/message-types';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be created', function() {
    BaseApplication.create();
  });

  it('pulls fragments from static prop', function() {

    var fakeFactory = {
      create({ app }) {

      }
    };

    class SubApplication extends BaseApplication {
      static fragments = [
        Fragment.create({ id: 'fragment', type: 'application', factory: fakeFactory }),
        Fragment.create({ id: 'fragment2', type: 'application', factory: fakeFactory })
      ];
    }
    var a = SubApplication.create();
    expect(a.fragments.length).to.be(2);
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
