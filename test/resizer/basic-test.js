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
});