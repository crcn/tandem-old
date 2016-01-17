import ServerApplication from './app';
var app = ServerApplication.create();

app.initialize({
  cwd: process.cwd(),
  http: {
    port: 8090,
    domain: 'localhost'
  },
  socketio: {
    port: 8091
  }
});

module.exports = app;
