import ServerApplication from './application';
import { VERBOSE, ALL, ERROR, WARN } from 'common/logger/levels';

var app = ServerApplication.create({
  config: {
    socketio: {
      port: 8080
    },
    logger: {
      level: ALL
    }
  }
});

app.initialize();

module.exports = app;
