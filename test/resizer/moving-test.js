import { createApp, waitForAllPromises, createElementEntity } from 'test/helpers/utils';
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

  it('when an element position is absolute and top/left props are undefined, maintains correct position', async function() {

    app.setProperties({
      rootEntity: createElementEntity(app, {
        tagName: 'div'
      }, [
        {
          tagName: 'div',
          position: 'relative',
          width:  '100px',
          height: '100px'
        },
        {
          tagName: 'div',
          position: 'absolute',
          width:  '100px',
          height: '100px'
        },
      ])
    });

    await waitForAllPromises();


  });
});