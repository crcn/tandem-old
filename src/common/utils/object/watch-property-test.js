import expect from 'expect.js';
import watchProperty from './watch-property';
import { NoopBus } from 'mesh';
import observable from 'common/object/mixins/observable';
import CoreObject from 'common/object';

describe(__filename + '#', () => {

  @observable
  class ObservableObject extends CoreObject {

  }

  it('throws an error if the bus property does not exist', () => {
    expect(() => {
      watchProperty({}, 'name');
    }).to.throwError();
  });

  it('can watch the observable object for a simple change', () => {

    var v;
    var target = ObservableObject.create({ bus: NoopBus.create() });

    watchProperty(target, 'name', (name) => {
      v = name;
    });

    target.setProperties({ name: 'blarg' });
    expect(v).to.be('blarg');
  });

  xit('can watch a nested property', () => {
    var v;
    var target = ObservableObject.create({ bus: NoopBus.create() });
    watchProperty(target, 'a.b', (value) => {
      v = value;
    });

    target.setProperties({ a: { b: 1 } });

    expect(v).to.be(1);
  });
});
