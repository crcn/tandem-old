import { IBus, IDispatcher } from "./base";
import { DuplexStream, ChunkQueue, ReadableStream, WritableStream, Sink, wrapDuplexStream, WritableStreamDefaultWriter, ReadableStreamDefaultReader } from "../streams";

export interface IRemoteBusAdapter {
  send(message: any): any;
  addListener(message: any): any;
}

const PASSED_THROUGH_KEY = "$$passedThrough";

class RemoteBusMessage {
  static readonly DISPATCH = "dispatch";
  static readonly CHUNK    = "chunk";
  static readonly RESOLVE  = "resolve";
  static readonly REJECT   = "reject";
  static readonly CLOSE    = "close";
  static readonly ABORT    = "abort";
  constructor(readonly type: string, readonly source: string, readonly dest: string, readonly payload?: any) {

  }
}

let _i = 0;
const createUID = () => {
  return String(_i++);
}

class RemoteRequest {
  readonly writer: WritableStreamDefaultWriter<any>;
  private _resolve: (value: any) => any;
  private _reject: (value: any) => any;

  constructor(readonly uid: string, readonly dest: string, readonly adapter: IRemoteBusAdapter, private _serializer: any, readonly input: ReadableStream<any>, readonly output: WritableStream<any>) {
    this.writer = this.output.getWriter();
  }

  start() {
    this.input.pipeTo(new WritableStream({
      write: (chunk) => {
        return this.send(new RemoteBusMessage(RemoteBusMessage.CHUNK, this.uid, this.dest, this._serializer.serialize(chunk)));
      },
      close: () => {
        return this.send(new RemoteBusMessage(RemoteBusMessage.CLOSE, this.uid, this.dest));
      },
      abort: (reason: any) => {
        return this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, this.uid, this.dest, this._serializer.serialize(reason)));
      },
    })).catch((e) => {
      this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, this.uid, this.dest, this._serializer.serialize(e)));
    });
  }

  private send(message: RemoteBusMessage) {
    this.adapter.send(message);
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject  = reject;
    });
  }

  resolve(value) {
    this._resolve(value || 1);
  }

  reject(value) {
    this._reject(value);
  }
}

export class RemoteBus<T> implements IBus<T> {

  private _pendingRequests: Map<string, RemoteRequest>;
  private _uid: string;

  constructor(private _adapter: IRemoteBusAdapter, private _localDispatcher: IDispatcher<T, any>, private _serializer?: any) {
    this._pendingRequests  = new Map();
    this._uid = createUID();

    if (!_serializer) {
      this._serializer = {
        serialize   : o => o,
        deserialize : i => i
      };
    }

    this._adapter.addListener(this.onMessage.bind(this));
  }

  private onMessage(message: RemoteBusMessage) {
    if (message.type === RemoteBusMessage.DISPATCH) {
      this.onInputDispatch(message);
    } else if (message.type === RemoteBusMessage.CHUNK) {
      this.onChunk(message);
    } else if (message.type === RemoteBusMessage.CLOSE) {
      this.onClose(message);
    }  else if (message.type === RemoteBusMessage.ABORT) {
      this.onAbort(message);
    } else if (message.type === RemoteBusMessage.RESOLVE) {
      this.onResolve(message);
    } else if (message.type === RemoteBusMessage.REJECT) {
      this.onReject(message);
    }
  }

  private onResolve({ source, dest, payload }: RemoteBusMessage) {
    this._pendingRequests.get(dest).resolve(payload);
  }

  private onReject({ source, dest, payload }: RemoteBusMessage) {
    this._pendingRequests.get(dest).reject(payload);
  }

  private onChunk({ source, dest, payload }: RemoteBusMessage) {
    this.respond(this._pendingRequests.get(dest).writer.write(this._serializer.deserialize(payload, null)), source, dest);
  }

  private resolve(source: string, dest: string, result: any) {
    this._adapter.send(new RemoteBusMessage(RemoteBusMessage.RESOLVE, source, dest, result));
  }

  private reject(source: string, dest: string, uid: string, error: any) {
    this._adapter.send(new RemoteBusMessage(RemoteBusMessage.REJECT, source, dest, error));
  }

  private onClose({ source, dest, payload }: RemoteBusMessage) {
    this.respond(this._pendingRequests.get(dest).writer.close(), source, dest);
  }

  private respond(promise: Promise<any>, source: string, dest: string) {
    promise.then(this.resolve.bind(this, dest, source)).catch(this.reject.bind(this, dest, source));
  }

  private onAbort({ source, dest, payload }: RemoteBusMessage) {
    this._pendingRequests.get(dest).writer.abort(payload).catch(e => {});
  }

  private onInputDispatch({ payload, source, dest }: RemoteBusMessage) {
    const { writable, readable } = wrapDuplexStream(this._localDispatcher.dispatch(this._serializer.deserialize(payload, null)));
    const req = new RemoteRequest(dest, source, this._adapter, this._serializer, readable, writable);
    this._pendingRequests.set(req.uid, req);
    req.start();
  }

  dispatch(message: T) {

    if (!message[PASSED_THROUGH_KEY]) {
      message[PASSED_THROUGH_KEY] = {};
    }

    return new DuplexStream((input, output) => {
      const uid = createUID();


      if (message[PASSED_THROUGH_KEY][this._uid]) {
        return output.getWriter().close();
      }

      message[PASSED_THROUGH_KEY][this._uid] = true;

      const req = new RemoteRequest(`req:${uid}`, `res:${uid}`, this._adapter, this._serializer, input, output);
      this._pendingRequests.set(req.uid, req);
      this._adapter.send(new RemoteBusMessage(RemoteBusMessage.DISPATCH, req.uid, req.dest, this._serializer.serialize(message)));
      req.start();
    });
  }

}