import { inject, IDisposable, loggable, Logger } from "@tandem/common"; 
import { FileSystemProvider } from "../providers";

export interface IURIWatcher {
  dispose(): any;
}


@loggable()
export abstract class URIProtocol {
  protected readonly logger: Logger;

  private _watchers: {
    [Identifier: string]: {
      listeners: Function[],
      instance: IURIWatcher
    }
  } = {};

  abstract read(uri: string): Promise<string|Buffer>;
  abstract write(uri: string, content: any): Promise<any>;

  watch(uri: string, onChange: () => any) {

    let _fileWatcher: { instance: IURIWatcher, listeners: Function[] };

    if (!(_fileWatcher = this._watchers[uri])) {
      _fileWatcher = this._watchers[uri] = {
        listeners: [],
        instance: this.watch2(uri, () => {
          for (let i = _fileWatcher.listeners.length; i--;) {
            _fileWatcher.listeners[i]();
          }
        })
      }
    }

    const { listeners, instance } = _fileWatcher;

    listeners.push(onChange);

    return {
      dispose: () => {
        const index = listeners.indexOf(onChange);
        if (index === -1) return;
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          instance.dispose();
        }
      }
    }
  }


  protected abstract watch2(uri: string, onChange: () => any): IDisposable;

  protected removeProtocol(uri: string) {
    return uri.replace(/^\w+:\/\//, "");
  }
}

export class HTTPURIProtocol extends URIProtocol {
  async read(uri: string): Promise<string> {
    return (await fetch(uri)).text();
  }
  async write(uri: string, content: string) {
    this.logger.info(`Cannot currenty write to uris`);
  }
  watch(uri: string, onChange: () => any) {
    this.logger.info(`Cannot currently watch uris`);

    return {
      dispose() { }
    }
  }
}