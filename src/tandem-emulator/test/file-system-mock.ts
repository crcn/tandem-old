import { WrapBus } from "mesh";
import { IFileSystem } from "../file-system";
import { Action, IReadFileActionResponseData, Observable } from "tandem-common";



export class MockFileSystem extends Observable implements IFileSystem {

  private _mockFiles = {};

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
    }
  }
}