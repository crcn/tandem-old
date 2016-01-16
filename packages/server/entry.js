import ServerApplication from './app';
var app = ServerApplication.create();
app.initialize({
  http: {
    port: 8090
  },
  socketio: {
    port: 8091
  }
});
