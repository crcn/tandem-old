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
    //console.log(targetEntity.attributes.style);
    //console.log(bounds.left);

    // next check to see whether the resizer is in the correct place in the canvas
  });
});