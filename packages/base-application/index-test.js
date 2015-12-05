import BaseApplication from './index';
import BaseObject from 'base-object';
import { Entry } from 'registry';
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
});
