import net = require("net");
import os = require("os");
import path = require("path");


import { EditorFamilyType, PingRequest } from "@tandem/editor/common";

import { 
  IDispatcher, 
  readOneChunk, 
  TransformStream,
  filterFamilyMessage, 
} from "@tandem/mesh";

import { createSandboxProviders } from "@tandem/sandbox";

import {
  Kernel,
  Status,
  SockBus,
  bindable,
  BrokerBus,
  serialize, 
  CoreEvent,
  Observable,
  PropertyWatcher,
  deserialize,
  IDisposable,
  KernelProvider,
  PrivateBusProvider,
} from "@tandem/common";

const SOCK_FILE = path.join(os.tmpdir(), `tandem-${process.env.USER}.sock`);

export type RemoteBusType = IDispatcher<any, any> & IDisposable;

export abstract class BaseTandemClient extends Observable implements IDisposable {
  readonly kernel: Kernel;
  readonly bus: BrokerBus;
  private _connected: boolean;
  private _remoteBus: RemoteBusType;

  @bindable()
  public status: Status = new Status(Status.IDLE);

  readonly statusPropertyWatcher: PropertyWatcher<BaseTandemClient, Status>;

  constructor() {
    super();

    this.statusPropertyWatcher = new PropertyWatcher<BaseTandemClient, Status>(this, "status");

    this.kernel = new Kernel(
      new KernelProvider(),
      new PrivateBusProvider(this.bus = new BrokerBus()),
     createSandboxProviders()
    );

    this._connect();
  }

  private async _connect() {
    if (this._connected) return;
    this._connected = true;

    this.status = new Status(Status.LOADING);

    const reconnect = () => {
      if (!this._connected) return;
      this._connected = false;
      this.bus.unregister(remoteBus);
      setTimeout(this._connect.bind(this), 1000);
    }

    const remoteBus = this._remoteBus = this._createRemoteBus(reconnect);
    this.bus.register(remoteBus);

    // ping the remote tandem app to ensure that we have a connection here -- this information
    // is typically displayed to the user.
    const ping = async () => {
      const value = await readOneChunk(this.bus.dispatch(new PingRequest()));
      if (!value) return setTimeout(ping, 1000);
      this.status = new Status(Status.COMPLETED);
    }

    ping();
  }

  dispose() {
    if (this._remoteBus) {
      this._remoteBus.dispose();
    }
  }
  protected abstract _createRemoteBus(onClose: () => any): RemoteBusType;
}

/**
 * .sock file (local) client for communicating
 * with tandem instance running on the same machine.
 */

export class TandemSockClient extends BaseTandemClient {
  private _connection: net.Socket;

  constructor(readonly family: string) {
    super();
  }

  dispose() {
    super.dispose();
    if (this._connection) {
      this._connection.end();
    }
  }
  
  protected _createRemoteBus(onClose: () => any) {
    
    const connection = net.connect({ path: SOCK_FILE } as any);

    const remoteBus = new SockBus({ family: this.family, connection: connection, testMessage: filterFamilyMessage }, this.bus, { serialize, deserialize });
    connection.once("close", onClose).once("error", onClose);

    return {
      dispatch(message) {
        return remoteBus.dispatch(message);
      },
      dispose() {
        connection.end();
        remoteBus.dispose();
      }
    }
  }
}


// /**
//  * client for communicat
//  */

// export class TandemRemoteClient extends BaseTandemClient {
//   constructor(readonly host: string) {
//     super();
//     throw new Error(`Not implemented yet`); 
//   }

//   _connect2() {

//   }

//   dispose() {

//   }
// }