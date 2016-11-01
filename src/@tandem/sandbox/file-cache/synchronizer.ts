import { WrapBus } from "mesh";
import { FileCache } from "./file-cache";
import { IBrokerBus, diffArray } from "@tandem/common";
import { IFileSystem, IFileWatcher } from "@tandem/sandbox/file-system";

export class FileCacheSynchronizer {
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
        this._watchers[value] = this._fileSystem.watchFile(value, this.onLocalFindChange.bind(this, value));
      },
      visitRemove: ({ index }) => {
        (<IFileWatcher>this._watchers[a[index]]).dispose();
      },
      visitUpdate() { }
    });
  }

  private async onLocalFindChange(filePath: string) {
    const entity = await this._cache.item(filePath);

    // just set the timestamp instead of checking lstat -- primarily
    // to ensure that this class works in other environments.
    entity.sourceFileModifiedAt = Date.now();

    // override any data urls that might be stored on the entity
    entity.setFileUrl(filePath).save();
  }
}
