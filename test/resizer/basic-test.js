import { createApp, waitForAllPromises } from 'test/utils';
import { create as createHtmlEntity1Fixture } from 'test/helpers/fixtures/html-entity1';
import * as actions from 'test/helpers/actions';

import expect from 'expect.js';

describe(__filename + '#', function() {

  var app;
  var element;

  beforeEach(async function() {
    app = await createApp();
    createHtmlEntity1Fixture({ app });
    element = app.config.element;
  });

  afterEach(function() {
    app.dispose();
  });

  it('shows when an element is in focus', async function() {
    var targetEntity = app.rootEntity.children[0];
    var preview = targetEntity.preview;
    actions.setSelection(app, [targetEntity]);
    await waitForAllPromises();
    app.preview.setZoom(1);

    // ensure that only one item is currently selected
    expect(app.selection.length).to.be(1);

      // get the bounds of the entity -- ensure it's to scale (true)
    var bounds = preview.getBoundingRect(true);
    var resizer = app.config.element.querySelector('.m-resizer-component--selection');
    var targetElement = document.getElementById(targetEntity.id);
    await waitForAllPromises();

    var targetElementBounds = targetElement.getBoundingClientRect();
    var resizerBounds = resizer.getBoundingClientRect();

    // account for resizer boxes
    expect(resizerBounds.left + 4).to.be(targetElementBounds.left);
    expect(resizerBounds.right - 4).to.be(targetElementBounds.right);
    expect(resizerBounds.top + 4).to.be(targetElementBounds.top);
    expect(resizerBounds.bottom - 10).to.be(targetElementBounds.bottom);
  });

  it('can scale 1 item using the WEST point', async function() {
    var targetEntity = app.rootEntity.children[0];
    var preview = targetEntity.preview;
    actions.setSelection(app, [targetEntity]);
    await waitForAllPromises();
    app.preview.setZoom(0.7);

    var element = app.config.element.querySelector('.point-circle-w');


    var delta = {
      left: 50,
      top: 50
    };

    var prect = targetEntity.preview.getStyle(true);

    //todo - make this into a util - mouseUtils.drag(element, { left: 100, top: 100 })
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: delta.x, clientY: delta.y }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    var crect = targetEntity.preview.getStyle(true);

    expect(Math.round(crect.left + 100)).to.be(Math.round(prect.left));
  });
});