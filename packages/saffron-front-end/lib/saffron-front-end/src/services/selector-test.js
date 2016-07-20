"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
// import expect from 'expect.js';
const selector_1 = require('./selector');
const index_1 = require('saffron-common/src/fragments/index');
const base_1 = require('saffron-common/src/application/base');
const chai_1 = require('chai');
const index_2 = require('saffron-front-end/src/actions/index');
const collection_1 = require('selection/collection');
describe(__filename + '#', () => {
    let app;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        app = new base_1.default();
        app.register(selector_1.fragment);
        yield app.initialize();
    }));
    it('defines "selection" property on application on selection event', function () {
        var item = { name: 'blarg' };
        app.bus.execute(new index_2.ToggleSelectAction(item));
        chai_1.expect(app.selection.length).to.equal(1);
    });
    it('only selects one item if multi is false', function () {
        var item = { name: 'blarg' };
        app.bus.execute(new index_2.SelectAction(item));
        chai_1.expect(app.selection.length).to.equal(1);
        app.bus.execute(new index_2.SelectAction(item));
        chai_1.expect(app.selection.length).to.equal(1);
    });
    it('selects multiple items if multi is true', function () {
        app.bus.execute(new index_2.ToggleSelectAction({ name: 'blarg' }));
        chai_1.expect(app.selection.length).to.equal(1);
        app.bus.execute(new index_2.ToggleSelectAction({ name: 'blarg' }, true));
        chai_1.expect(app.selection.length).to.equal(2);
        app.bus.execute(new index_2.ToggleSelectAction({ name: 'blarg' }));
        chai_1.expect(app.selection.length).to.equal(1);
    });
    it('removes an item from the selection if it already exists', function () {
        var item = { name: 'blarg' };
        app.bus.execute(new index_2.ToggleSelectAction(item));
        chai_1.expect(app.selection.length).to.equal(1);
        app.bus.execute(new index_2.ToggleSelectAction(item, true));
        chai_1.expect(app.selection.length).to.equal(0);
    });
    it('picks the correct collection type depending on the item type', function () {
        class DisplayCollection extends collection_1.default {
        }
        class OtherCollection extends collection_1.default {
        }
        app.fragments.register(new index_1.ClassFactoryFragment('selection-collections/display', DisplayCollection));
        app.fragments.register(new index_1.ClassFactoryFragment('selection-collections/other', OtherCollection));
        app.bus.execute(new index_2.ToggleSelectAction({ type: 'display' }));
        chai_1.expect(app.selection).to.be.an.instanceof(DisplayCollection);
        app.bus.execute(new index_2.ToggleSelectAction({ type: 'display' }, true));
        chai_1.expect(app.selection).to.be.an.instanceof(DisplayCollection);
        chai_1.expect(app.selection.length).to.equal(2);
        app.bus.execute(new index_2.ToggleSelectAction({ type: 'other' }, true));
        chai_1.expect(app.selection).to.be.an.instanceof(OtherCollection);
        chai_1.expect(app.selection.length).to.equal(1);
    });
    it('can deselect all be omitting item', function () {
        app.bus.execute(new index_2.ToggleSelectAction({ type: 'display' }));
        app.bus.execute(new index_2.ToggleSelectAction({ type: 'display' }, true));
        chai_1.expect(app.selection.length).to.equal(2);
        app.bus.execute(new index_2.ToggleSelectAction());
        chai_1.expect(app.selection.length).to.equal(0);
    });
    it('can select multiple in an event', function () {
        app.bus.execute(new index_2.ToggleSelectAction([{ type: 'display' }, { type: 'display' }]));
        chai_1.expect(app.selection.length).to.equal(2);
    });
    it('can turn toggling off', function () {
        var item = {};
        app.bus.execute(new index_2.ToggleSelectAction(item));
        app.bus.execute(new index_2.ToggleSelectAction(item));
        chai_1.expect(app.selection.length).to.equal(0);
    });
});
//# sourceMappingURL=selector-test.js.map