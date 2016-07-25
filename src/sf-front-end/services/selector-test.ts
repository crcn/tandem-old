// import expect from 'expect.js';
import { fragment as selectorFragment } from './selector';
import { ClassFactoryFragment } from 'sf-core/fragments';
import { Application } from 'sf-common/applications';
import { expect } from 'chai';
import { SelectAction, ToggleSelectAction } from 'sf-front-end/actions/index';

describe(__filename + '#', () => {

  let app:any;


  beforeEach(async () => {
    app = new Application();
    app.fragments.register(selectorFragment);
    await app.initialize();
  });

  xit('defines "selection" property on application on selection event', function () {
    var item = { name: 'blarg' };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(1);
  });

  xit('only selects one item if multi is false', function () {
    var item = { name: 'blarg' };
    app.bus.execute(new SelectAction(item));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new SelectAction(item));
    expect(app.selection.length).to.equal(1);
  });

  xit('selects multiple items if multi is true', function () {
    app.bus.execute(new ToggleSelectAction({ name: 'blarg' }));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction({ name: 'blarg' }, true));
    expect(app.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction({ name: 'blarg' }));
    expect(app.selection.length).to.equal(1);
  });

  xit('removes an item from the selection if it already exists', function () {
    var item = { name: 'blarg' };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction(item, true));
    expect(app.selection.length).to.equal(0);
  });

  xit('picks the correct collection type depending on the item type', function () {

    class DisplayCollection extends Array<any> { }
    class OtherCollection extends Array<any> { }

    app.fragments.register(new ClassFactoryFragment('selection-collections/display', DisplayCollection));
    app.fragments.register(new ClassFactoryFragment('selection-collections/other', OtherCollection));

    app.bus.execute(new ToggleSelectAction({ type: 'display' }));
    expect(app.selection).to.be.an.instanceof(DisplayCollection);
    app.bus.execute(new ToggleSelectAction({ type: 'display' }, true));
    expect(app.selection).to.be.an.instanceof(DisplayCollection);
    expect(app.selection.length).to.equal(2);

    app.bus.execute(new ToggleSelectAction({ type: 'other' }, true));
    expect(app.selection).to.be.an.instanceof(OtherCollection);
    expect(app.selection.length).to.equal(1);
  });

  xit('can deselect all be omitting item', function () {
    app.bus.execute(new ToggleSelectAction({ type: 'display' }));
    app.bus.execute(new ToggleSelectAction({ type: 'display' }, true));
    expect(app.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction());
    expect(app.selection.length).to.equal(0);
  });

  xit('can select multiple in an event', function () {
    app.bus.execute(new ToggleSelectAction([{ type: 'display' }, { type: 'display' }]));
    expect(app.selection.length).to.equal(2);
  });

  xit('can turn toggling off', function () {
    var item = {};
    app.bus.execute(new ToggleSelectAction(item));
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(0);
  });
});
