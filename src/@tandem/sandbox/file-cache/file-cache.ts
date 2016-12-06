import memoize =  require("memoizee");
import { FileCacheSynchronizer } from "./synchronizer";

import {
  inject,
  Injector,
  Observable,
  IBrokerBus,
  InjectorProvider,
  PrivateBusProvider,
  ActiveRecordCollection,
} from "@tandem/common";

import { IFileSystem } from "../file-system";
import { FileSystemProvider } from "../providers";
import { FileCacheItem, IFileCacheItemData } from "./item";

// TODO - move a lot of this logic to ActiveRecordCollection
// TODO - remove files here after TTL
export class FileCache extends Observable {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  private _synchronizer: FileCacheSynchronizer;
  private _collection: ActiveRecordCollection<FileCacheItem, IFileCacheItemData>;

  constructor() {
    super();
  }

  public $didInject() {
    this._collection = ActiveRecordCollection.create(this.collectionName, this._injector, (source: IFileCacheItemData) => {
      return this._injector.inject(new FileCacheItem(source, this.collectionName, this._fileSystem));
    });
    this._collection.load();
    this._collection.sync();
  }

  eagerFindByFilePath(filePath) {
    return this.collection.find(item => item.filePath === filePath);
  }

  get collection() {
    return this._collection;
  }

  get collectionName() {
    return "fileCache";
  }

  /**
   * Returns an existing cache item entry, or creates a new one
   * from the file system
   */

  item = memoize(async (filePath: string): Promise<FileCacheItem> => {
    if (filePath == null) throw new Error(`File path must not be null or undefined`);
    return this.collection.find((entity) => entity.filePath === filePath) || await this.collection.loadOrInsertItem({ filePath },{
      filePath: filePath,
      url: "file://" + filePath
    });
  }, { promise: true }) as (filePath) => Promise<FileCacheItem>;

  /**
   * Synchronizes the file cache DS with the file system. This is intended
   * to be used the master process -- typically the node server.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = this._injector.inject(new FileCacheSynchronizer(this, this._bus, this._fileSystem)));
  }
}
