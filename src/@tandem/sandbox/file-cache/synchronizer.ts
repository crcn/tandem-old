import { WrapBus } from "mesh";
import { FileCache } from "./file-cache";
import { IFileSystem, IFileWatcher } from "@tandem/sandbox/file-system";
import { IBrokerBus, diffArray, inject, loggable, Logger } from "@tandem/common";

// TODO - need to check if file cache is up to date with local
// TODO - needs to support other protocols such as http, and in-app
@loggable()
export class FileCacheSynchronizer {

  protected logger: Logger;
  private _watchers: any;

  constructor(private _cache: FileCache, private _bus: IBrokerBus, private _fileSystem: IFileSystem) {
    this._watchers = {};
    this._cache.collection.observe(new WrapBus(this.update.bind(this)));
    this.update();
  }

  private update() {
    const a = Object.keys(this._watchers);
    const b = this._cache.collection.map((item) => item.filePath);

    diffArray(a, b, (a, b) => a === b ? 0 : -1).accept({
      visitInsert: ({ index, value }) => {

        // TODO - fix this -- shouldn't be watching files that do not exist
        try {
          if (!/^\w+:\/\//.test(value))
          this._watchers[value] = this._fileSystem.watchFile(value, this.onLocalFindChange.bind(this, value));
        } catch(e) {
          this.logger.error(e.stack);
        }
      },
      visitRemove: ({ index }) => {
        (<IFileWatcher>this._watchers[a[index]]).dispose();
      },
      visitUpdate() { }
    });
  }

  private async onLocalFindChange(filePath: string) {
    const entity = await this._cache.item(filePath);

    this.logger.verbose(`${filePath} changed, updating cache.`);

    // just set the timestamp instead of checking lstat -- primarily
    // to ensure that this class works in other environments.
    entity.sourceFileModifiedAt = Date.now();

    // override any data urls that might be stored on the entity
    entity.setFileUrl(filePath).save();
  }
}
