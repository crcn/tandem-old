import { IDispatcher, readAllChunks, IStreamableDispatcher, FilterBus, filterFamilyMessage, setMessageTarget } from "@tandem/mesh";
import { isMaster } from "cluster";
import { 
  SockBus, 
  CoreEvent, 
  serialize, 
  deserialize, 
  CoreApplicationService, 
  LoadApplicationRequest, 
  InitializeApplicationRequest, 
} from "@tandem/common";
import { EditorFamilyType, IEditorCommonConfig } from "@tandem/editor/common";
import os =  require("os");
import path =  require("path");
import net =  require("net");
import fsa = require("fs-extra");

const SOCK_FILE = path.join(os.tmpdir(), `tandem-${process.env.USER}.sock`);

export class SockService extends CoreApplicationService<IEditorCommonConfig> {

  private _socketFile: string;

  constructor() {
    super();
    this._socketFile = SOCK_FILE;
  }

  /**
   */

  [LoadApplicationRequest.LOAD](action: LoadApplicationRequest) {

    return new Promise((resolve, reject) => {
      let bus: IDispatcher<any, any>;

      const client = net.connect({ path: this._socketFile } as any);

      client.once("connect", async () => {
        const remoteBus = this._registerSocketBus(client);
        resolve();
      });

      client.once("error", this._startSocketServer.bind(this));
      client.once("error", resolve);
    });
  }

  private _registerSocketBus(connection: net.Socket) {

    const bus = new SockBus({ family: this.config.family, connection, testMessage: filterFamilyMessage }, {
      dispatch: (message) => {
        return this.bus.dispatch(message);
      }
    }, { serialize, deserialize });

    this.bus.register(bus);
    connection.on("close", () => {
      this.bus.unregister(bus);
    });
    return bus;
  }

  private _startSocketServer() {
    this._deleteSocketFile();
    const server = net.createServer(this._registerSocketBus.bind(this));

    server.listen(SOCK_FILE);
  }

  private _deleteSocketFile() {
    fsa.removeSync(SOCK_FILE);
  }
}
