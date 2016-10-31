import { ReadableStream } from "./readable-stream";

export interface IChunk {
  value?: any;
  done: boolean;
}

export abstract class BaseReadableStreamReader {
  constructor(protected _stream: ReadableStream) { }

  /**
   * Returns a promise that will be fullfilled when the stream
   * becones closed or the reader's lock is released
   */

  abstract get closed();

  /**
   */

  abstract cancel(reason: any);

  /**
   * reads bytes into view and return a promise with a possibly
   * transfered buffer
   */

  abstract read(view);

  /**
   * Releases the reader's lock. After it's released, the reader
   * is no longer active.
   *
   * A reader's lock cannot be released while it still has a pending read request. Attempting to do so
   * will through a TypeError and leave the reader in a locked stream.
   */

  abstract releaseLock();
}

export class ReadableStreamDefaultReader extends BaseReadableStreamReader {
  cancel(reason) { }
  read(view) { }
  releaseLock() { }
  get closed() {
    return null;
  }
}

export class ReadableStreamBYOBReader extends BaseReadableStreamReader {
  cancel(reason) { }
  read(view) { }
  releaseLock() { }
  get closed() {
    return null;
  }
}