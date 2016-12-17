import { inject, Injector, InjectorProvider } from "@tandem/common";
import { URIProtocol, IURIProtocolReadResult, URIProtocolProvider } from "../uri";
import { FileCacheProvider } from "../providers";
import { FileCacheItem } from "./item";

import { FileCache } from "./file-cache";

export class FileCacheProtocol extends URIProtocol {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

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

  async fileExists(uri: string) {
    return !!(await this._find(uri));
  }

  async write(uri: string, content: any) {
    let type;

    // inefficient, but we need to store the content as the same data type
    // as the source URI -- which can only (currently) be fetched by reading the doc.
    // Might be good to implement a separate protocol.readContentType() method instead.
    try {
      type = (await URIProtocolProvider.lookup(uri, this._injector).read(uri)).type;
    } catch(e) {
      // eat it -- file cache will provide content type
    }
    
    return this._fileCache.save(uri, { type, content });
  }

  _find(uri: string) {
    return this._fileCache.collection.loadItem({ sourceUri: uri });
  }
}