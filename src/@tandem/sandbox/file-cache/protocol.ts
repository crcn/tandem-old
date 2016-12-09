import { inject } from "@tandem/common";
import { URIProtocol } from "../uri";
import { FileCacheProvider } from "../providers";
import { FileCacheItem } from "./item";
import { FileCache } from "./file-cache";

export class FileCacheProtocol extends URIProtocol {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  async read(uri: string) {
    const item = await this._find(uri);
    return item && await item.read();
  }

  watch2(uri: string, onChange: () => any) {
    this.logger.info(`Cannot currently watch file cache items`);
    return {
      dispose() {
      }
    }
  }

  async exists(uri: string) {
    return !!(await this._find(uri));
  }

  async write(uri: string, content: any) {
    return this._fileCache.add(this.removeProtocol(uri), content);
  }

  _find(uri: string) {
    return this._fileCache.collection.loadItem({ sourceUri: this.removeProtocol(uri) });
  }
}