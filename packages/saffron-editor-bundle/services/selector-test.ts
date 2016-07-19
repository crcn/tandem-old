// import expect from 'expect.js';
import { fragment as selectorFragment } from './selector';
import { FactoryFragment } from 'saffron-common/fragments';
import BaseApplication from 'saffron-common/application/base';
import expect from 'expect.js';
import { SelectEvent, ToggleSelectEvent } from 'saffron-editor-bundle/selection/events';
import SelectionCollection from 'saffron-editor-bundle/selection/collection';

describe(__filename + '#', () => {

  let app;

  beforeEach(async () => {
    app = BaseApplication.create({
      fragments: [selectorFragment]
    });
    await app.initialize();
  });

  it('defines "selection" property on application on selection event', function () {
    var item = { name: 'blarg' };
    app.bus.execute(ToggleSelectEvent.create(item));
    expect(app.selection.length).to.be(1);
  });

  it('only selects one item if multi is false', function () {
    var item = { name: 'blarg' };
    app.bus.execute(SelectEvent.create(item));
    expect(app.selection.length).to.be(1);
    app.bus.execute(SelectEvent.create(item));
    expect(app.selection.length).to.be(1);
  });

  it('selects multiple items if multi is true', function () {
    app.bus.execute(ToggleSelectEvent.create({ name: 'blarg' }));
    expect(app.selection.length).to.be(1);
    app.bus.execute(ToggleSelectEvent.create({ name: 'blarg' }, true));
    expect(app.selection.length).to.be(2);
    app.bus.execute(ToggleSelectEvent.create({ name: 'blarg' }));
    expect(app.selection.length).to.be(1);
  });

  it('removes an item from the selection if it already exists', function () {
    var item = { name: 'blarg' };
    app.bus.execute(ToggleSelectEvent.create(item));
    expect(app.selection.length).to.be(1);
    app.bus.execute(ToggleSelectEvent.create(item, true));
    expect(app.selection.length).to.be(0);
  });

  it('picks the correct collection type depending on the item type', function () {

    class DisplayCollection extends SelectionCollection { }
    class OtherCollection extends SelectionCollection { }

    app.fragments.register(FactoryFragment.create({ ns: 'selection-collections/display', factory: DisplayCollection }));
    app.fragments.register(FactoryFragment.create({ ns: 'selection-collections/other', factory: OtherCollection }));

    app.bus.execute(ToggleSelectEvent.create({ type: 'display' }));
    expect(app.selection).to.be.an(DisplayCollection);
    app.bus.execute(ToggleSelectEvent.create({ type: 'display' }, true));
    expect(app.selection).to.be.an(DisplayCollection);
    expect(app.selection.length).to.be(2);

    app.bus.execute(ToggleSelectEvent.create({ type: 'other' }, true));
    expect(app.selection).to.be.an(OtherCollection);
    expect(app.selection.length).to.be(1);
  });

  it('can deselect all be omitting item', function () {
    app.bus.execute(ToggleSelectEvent.create({ type: 'display' }));
    app.bus.execute(ToggleSelectEvent.create({ type: 'display' }, true));
    expect(app.selection.length).to.be(2);
    app.bus.execute(ToggleSelectEvent.create());
    expect(app.selection.length).to.be(0);
  });

  it('can select multiple in an event', function () {
    app.bus.execute(ToggleSelectEvent.create([{ type: 'display' }, { type: 'display' }]));
    expect(app.selection.length).to.be(2);
  });

  it('can turn toggling off', function () {
    var item = {};
    app.bus.execute(ToggleSelectEvent.create(item));
    app.bus.execute(ToggleSelectEvent.create(item));
    expect(app.selection.length).to.be(0);
  });
});
