import * as sift from "sift";
import { Logger } from "tandem-common/logger";
import { Service } from "tandem-common/services";
import { IApplication } from "tandem-common/application";
import * as SocketIOBus from "mesh-socket-io-bus";
import { loggable, document } from "tandem-common/decorators";
import { ParallelBus, AcceptBus } from "mesh";
import { BaseApplicationService } from "tandem-common/services";
import { Dependencies, Injector } from "tandem-common/dependencies";
import { LoadAction, InitializeAction, PropertyChangeAction, LogAction } from "tandem-common/actions";

@loggable()
export class IOService<T extends IApplication> extends BaseApplicationService<T> {

  public logger: Logger;
  public _remoteActors: Array<any>;

  [LoadAction.LOAD]() {

    // remote actors which take actions from the server
    this._remoteActors = [];

    // add the remote actors to the application so that they
    // receive actions from other parts of the application
    this.app.bus.register(
      new AcceptBus(
        sift({ remote: { $ne: true }, type: {$nin: [LoadAction.LOAD, InitializeAction.INITIALIZE, LogAction.LOG, PropertyChangeAction.PROPERTY_CHANGE] }}),
        ParallelBus.create(this._remoteActors),
        null
      )
    );
  }

  /**
   */

  @document("pings remote connections")
  ping() {
    return "pong";
  }

  /**
   */

  addConnection = async (connection) => {
    this.logger.info("client connected");


    // setup the bus which wil facilitate in all
    // transactions between the remote service
    const remoteBus = SocketIOBus.create({
      connection: connection
    }, {
      execute: (action) => {
        action.remote = true;
        return this.bus.execute(action);
      }
    });

    this._remoteActors.push({
      execute(action) {
        let data;

        // very crude, but works for resolving circular JSON issues
        try {
          for (const key in action) {
            if (/object/.test(action[key]) && !/Array|Object/.test(action[key].constructor.name)) return;
          }

          data = JSON.parse(JSON.stringify(action));
        } catch (e) {
          return;
        }

        return remoteBus.execute(data);
      }
    });


    connection.once("disconnect", () => {
      this.logger.info("client disconnected");

      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteBus),
        1
      );
    });
  }

  static create<T extends IApplication>(dependencies: Dependencies): IOService<T> {
    return Injector.inject(new IOService<T>(), dependencies);
  }
}