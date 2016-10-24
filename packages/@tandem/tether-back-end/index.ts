import { SocketIOHandlerDependency } from "@tandem/back-end/dependencies";

const tetherSocketIoHandlerDependency = new SocketIOHandlerDependency("tether", (server) => {
  server.on("connection", (connection) => {
    connection.on("tether:connect", () => {
      server.emit("tether:connect");
    });

    connection.on("tether:render", (message) => {
      server.emit("tether:render", message);
    });

    connection.on("tether:paint", (message) => {
      server.emit("tether:paint", message);
    });

    connection.on("tether:rects", (message) => {
      server.emit("tether:rects", message);
    });

    connection.on("tether:clear", (message) => {
      server.emit("tether:clear", message);
    });
  });

});

export const tetherBackEndDependencies = [
  tetherSocketIoHandlerDependency
];