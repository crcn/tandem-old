import { createApp, waitForAllPromises } from 'test/utils';
import expect from 'expect.js';

/**
 * various assertions to ensure the application is properly cleaned up when app.dispose()
 * is called. This is important especially amongst specific features like a full application restart
 * without *actually* restarting the app -- something that may get implemented for alpha and beta testers.
 * This is also important to ensure that tests stay fast, and don't leak.
 */

describe(__filename + '#', function() {

  var app;

  beforeEach(async function() {
    app = await createApp();
  });


  it('removes itself from the config element when', async function() {
    expect(app.config.element.innerHTML).not.to.be('');
    app.dispose();
    // TODO - await app.runloop.idle()
    await waitForAllPromises();
    expect(app.config.element.innerHTML).to.be('');
  });
});