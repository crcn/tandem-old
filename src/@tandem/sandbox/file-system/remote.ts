import { BaseFileSystem } from "./base";
import { ReadFileAction, WatchFileAction } from "@tandem/sandbox/actions";
import { IActor, inject, IDisposable, PrivateBusProvider } from "@tandem/common";

export class RemoteFileSystem extends BaseFileSystem {

  constructor(@inject(PrivateBusProvider.ID) readonly bus: IActor) {
    super();
  }

  async readFile(filePath: string) {
    return await ReadFileAction.execute(filePath, this.bus);
  }

  async fileExists(filePath: string): Promise<boolean> {
    throw new Error(`Not implemented yet`);
  }

  async writeFile(filePath: string, content: any) {
    return Promise.reject(new Error("not implemented yet"))
  }

  watchFile2(filePath: string, onChange: () => any) {
    return WatchFileAction.execute(filePath, this.bus, onChange);
  }
}