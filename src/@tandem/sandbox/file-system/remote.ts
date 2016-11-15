import { IDispatcher } from "@tandem/mesh";
import { BaseFileSystem, IReadFileResultItem } from "./base";
import { inject, IDisposable, PrivateBusProvider } from "@tandem/common";
import { ReadFileAction, ReadDirectoryAction, WatchFileAction } from "@tandem/sandbox/actions";

export class RemoteFileSystem extends BaseFileSystem {

  constructor(@inject(PrivateBusProvider.ID) readonly bus: IDispatcher<any, any>) {
    super();
  }

  async readDirectory(directoryPath: string): Promise<IReadFileResultItem[]> {
    return await ReadDirectoryAction.dispatch(directoryPath, this.bus);
  }

  async readFile(filePath: string) {
    return await ReadFileAction.dispatch(filePath, this.bus);
  }

  async fileExists(filePath: string): Promise<boolean> {
    throw new Error(`Not implemented yet`);
  }

  async writeFile(filePath: string, content: any) {
    return Promise.reject(new Error("not implemented yet"))
  }

  watchFile2(filePath: string, onChange: () => any) {
    return WatchFileAction.dispatch(filePath, this.bus, onChange);
  }
}