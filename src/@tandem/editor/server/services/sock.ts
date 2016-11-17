import { IDispatcher, readAllChunks, IStreamableDispatcher, FilterBus, filterFamilyMessage } from "@tandem/mesh";
import { OpenProjectRequest } from "@tandem/editor/common";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
import { ApplicationServiceProvider } from "@tandem/common";
import { isMaster } from "cluster";
import { LoadAction, InitializeAction, SockBus, Action, isPublicAction, defineWorkerAction, isWorkerAction, serialize, deserialize } from "@tandem/common";
import * as os from "os";
import * as path from "path";
import * as net from "net";
import * as fsa from "fs-extra";

const SOCK_FILE = path.join(os.tmpdir(), `tandem-${process.env.USER}.sock`);

@defineWorkerAction()
class ExecAction extends Action {
  static readonly EXEC = "exec";
  constructor(readonly config: IEdtorServerConfig) {
    super(ExecAction.EXEC);
  }
  static dispatch(config: any, bus: IStreamableDispatcher<any>) {
    return readAllChunks(bus.dispatch(new ExecAction(config)));
  }
}

export class SockService extends CoreApplicationService<IEdtorServerConfig> {

  private _socketFile: string;
  private _argv: any;

  constructor() {
    super();
    this._socketFile = SOCK_FILE;
  }

  $didInject() {
    super.$didInject();
    this._argv = this.config.argv || {};
  }

  /**
   */

  [LoadAction.LOAD](action: LoadAction) {

    return new Promise((resolve, reject) => {
      let bus: IDispatcher<any, any>;

      const client = net.connect({ path: this._socketFile } as any);

      client.once("connect", async () => {
        const remoteBus = this._registerSocketBus(client);
        if (this._argv) {
          await ExecAction.dispatch(this.config, remoteBus);
        }

        if (this._argv.terminate) {
          client.end();
          this._printSockFile();
        }
      });

      client.once("error", this._startSocketServer.bind(this));
      client.once("error", resolve);
    });
  }

  [ExecAction.EXEC]({ config }: ExecAction) {
    if (config.argv && config.argv._.length) {
      OpenProjectRequest.dispatch({ filePath: path.resolve(config.cwd, config.argv._[0]) }, this.bus);
    }
  }

  [InitializeAction.INITIALIZE](action: LoadAction) {
    if (this.config.argv) {
      ExecAction.dispatch(this.config, this.bus);
    }
    this._printSockFile();
  }

  private _printSockFile() {
    if (this._argv.exposeSockFile) {
      console.log("---sock file start---\n%s\n---sock file end---", SOCK_FILE);
    }
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
