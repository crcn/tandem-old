import { Dependency, Dependencies } from "@tandem/common";
export type socketIoHandlerType = (server: SocketIO.Server) => any;
export class SocketIOHandlerDependency extends Dependency<socketIoHandlerType> {
  static readonly SOCKET_IO_HANDLER_HS = "socketIoHandlers";

  constructor(id: string, handler: socketIoHandlerType) {
    super(SocketIOHandlerDependency.getNamespace(id), handler);
  }

  static getNamespace(id: string) {
    return [this.SOCKET_IO_HANDLER_HS, id].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SocketIOHandlerDependency>(this.getNamespace("**"));
  }

  static plugin(server: SocketIO.Server, dependencies: Dependencies) {
    for (const plugin of this.findAll(dependencies)) plugin.value(server);
  }
}