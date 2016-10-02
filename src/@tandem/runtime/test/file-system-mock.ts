import { WrapBus } from "mesh";
import { IFileSystem } from "../file-system";
import {
  Action,
  IActor,
  Observable,
  ReadFileAction,
  WatchFileAction,
  IReadFileActionResponseData,
} from "@tandem/common";

import { Response, WrapResponse } from "mesh";

export class MockFileSystem extends Observable implements IFileSystem, IActor {

  constructor() {
    super();
  }

  private _mockFiles: any = {};

  execute(action: Action): any {
    if (action.type === ReadFileAction.READ_FILE) {
      return WrapResponse.create(this.readFile((<ReadFileAction>action).path));
    } else if (action.type === WatchFileAction.WATCH_FILE) {
      const wfa = <WatchFileAction>action;
      return new Response((writable) => {
        this.watchFile(wfa.path, async () => writable.write(await this.readFile(wfa.path)));
      });
    }
  }

  addMockFile(file: IReadFileActionResponseData) {
    this._mockFiles[file.path] = file;
  }

  async readFile(path: string) {

    // simulate latency
    await new Promise((resolve) => setTimeout(resolve, 10));
    return this._mockFiles[path] || (() => { throw new Error(`File ${path} does not exist.`); })();
  }

  async writeFile(path: string, content: string) {
    this._mockFiles[path].content = content;
    this.notify(new Action(`fileChange:${path}`));
  }

  watchFile(path: string, onChange: Function) {
    const observer = new WrapBus((action) => action.type === `fileChange:${path}` && onChange());
    this.observe(observer);
    return {
      dispose: () => {
        this.unobserve(observer);
      }
    };
  }
}