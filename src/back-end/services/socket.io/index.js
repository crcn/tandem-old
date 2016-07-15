import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE, LOAD } from 'common/application/events';
import { AcceptBus, WrapBus, AttachDefaultsBus, ParallelBus } from 'mesh';
import sift from 'sift';
import createServer from 'socket.io';

export const fragment = ApplicationFragment.create({
  ns:'application/socketIoServer',
  initialize: create,
});

function create(app) {

  function initialize() {
    logger.info('server on port %d', port);
    const server = createServer();

    var remoteBusses = [];
    var remoteBus = ParallelBus.create(remoteBusses);

    remoteBus = AcceptBus.create(sift({ public: true, remote: { $ne: true } }), remoteBus);
    app.busses.push(remoteBus);

    server.on('connection', function (connection) {
      logger.info('client connected');
      let remoteBus = RemoteBus.create({
        addListener: connection.on.bind(connection, 'message'),
        send: connection.emit.bind(connection, 'message'),
      }, AttachDefaultsBus.create({ remote: true }, app.bus));

      remoteBusses.push(remoteBus);

      connection.once('close', function () {
        remoteBusses.splice(remoteBusses.indexOf(remoteBus), 1);
      });
    });

    server.listen(port);
  }
}
