import * as sift from "sift";
import { Logger } from "sf-core/logger";
import { Service } from "sf-core/services";
import { IApplication } from "sf-core/application";
import * as SocketIOBus from "mesh-socket-io-bus";
import { loggable, document } from "sf-core/decorators";
import { ParallelBus, AcceptBus } from "mesh";
import { BaseApplicationService } from "sf-core/services";
import { Dependencies, Injector } from "sf-core/dependencies";
import { INITIALIZE, LOG, LOAD, PROPERTY_CHANGE } from "sf-core/actions";

@loggable()
export default class IOService<T extends IApplication> extends BaseApplicationService<T> {

  public logger: Logger;
  public _remoteActors: Array<any>;

  load() {

    // remote actors which take actions from the server
    this._remoteActors = [];

    // add the remote actors to the application so that they
    // receive actions from other parts of the application
    this.app.bus.register(
      new AcceptBus(
        sift({ remote: { $ne: true }, type: {$nin: [LOAD, INITIALIZE, LOG, PROPERTY_CHANGE] }}),
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

  @document("returns the number of remote connections")
  getRemoteConnectionCount() {
    return this._remoteActors.length;
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
            if (/object/.test(action[key]) && action[key].constructor !== Object) return;
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