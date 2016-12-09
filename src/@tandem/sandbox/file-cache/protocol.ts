import { inject } from "@tandem/common";
import { URLProtocol } from "../url";
import { FileCacheProvider } from "../providers";
import { FileCache } from "./file-cache";

export class FileCacheProtocol extends URLProtocol {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  async read(url: string) {
    const item = await this._fileCache.collection.loadItem({ filePath: this.removeProtocol(url) })
    return item && item.read();
  }

  watch(url: string, onChange: () => any) {
    this.logger.info(`Cannot currently watch file cache items`);
    return {
      dispose() {
      }
    }
  }

  async write(url: string, content: any) {
    return this._fileCache.add(this.removeProtocol(url), content);
  }
}