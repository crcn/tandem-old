import { createApp, waitForAllPromises } from 'test/helpers/utils';
import { create as createHtmlEntity1Fixture } from 'test/helpers/fixtures/html-entity1';
import * as actions from 'test/helpers/actions';

import expect from 'expect.js';

describe(__filename + '#', function() {

  var app;
  var element;

  beforeEach(async function () {
    app = await createApp();
    createHtmlEntity1Fixture({ app });
    element = app.config.element;
  });

  afterEach(function () {
    app.dispose();
  });

  it('returns the correct rect bounds for multiple entities', async function () {
    actions.setSelection(app, app.rootEntity.children);
    app.preview.setZoom(0.7);
    await waitForAllPromises();
    expect(app.selection.length).to.be(2);

    // no zoom
    var bounds = app.selection.preview.getBoundingRect(false);
    expect(Math.round(bounds.width)).to.be(600);
    expect(Math.round(bounds.left)).to.be(300);
  });
});