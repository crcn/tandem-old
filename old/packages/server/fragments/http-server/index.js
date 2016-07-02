import express from 'express';
import { LOAD } from 'base/message-types';
import { TypeNotifier } from 'common/notifiers';
import { ApplicationFragment } from 'common/fragment/types';

export default ApplicationFragment.create({
  id: 'httpServer',
  factory: {
    create: create
  }
});

function create({ app }) {
  var server = app.httpServer = express();

  app.notifier.push(TypeNotifier.create(LOAD, load));

  function load() {
    server.use(express.static(app.config.cwd));
    var port = app.config.http.port;
    console.log('starting http server on port %d', port);
    server.listen(port);
  }
}
