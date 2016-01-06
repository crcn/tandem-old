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
    await waitForAllPromises();
  });

  afterEach(function() {
    app.dispose();
  });

  it('returns the proper dimensions of one entity at various preview zoom levels', async function() {
    var targetEntity = app.rootEntity.children[0];
    await waitForAllPromises();
    app.preview.setZoom(1);
    await waitForAllPromises();
    var preview = targetEntity.preview;

    // get the bounds of the entity -- ensure it's to scale (true)
    var bounds = preview.getBoundingRect(true);

    expect(bounds.left).to.be(300);
    expect(bounds.top).to.be(200);
    expect(bounds.width).to.be(100);
    expect(bounds.height).to.be(150);

    app.preview.setZoom(0.7);
    await waitForAllPromises();
    var bounds = preview.getBoundingRect(true);
    expect(Math.round(bounds.left)).to.be(210);
    expect(Math.round(bounds.top)).to.be(140);
  });

  it('maintains the same props if "zoom" is not provided in getBoundingRect()', async function() {
    var targetEntity = app.rootEntity.children[0];
    await waitForAllPromises();
    app.preview.setZoom(1);
    await waitForAllPromises();
    var preview = targetEntity.preview;

    // get the bounds of the entity -- ensure it's to scale (true)
    var bounds = preview.getBoundingRect(false);

    expect(bounds.left).to.be(300);
    expect(bounds.top).to.be(200);
    expect(bounds.width).to.be(100);
    expect(bounds.height).to.be(150);

    app.preview.setZoom(0.7);
    await waitForAllPromises();
    var bounds = preview.getBoundingRect(false);
    expect(Math.round(bounds.left)).to.be(300);
    expect(Math.round(bounds.top)).to.be(200);
  });

});