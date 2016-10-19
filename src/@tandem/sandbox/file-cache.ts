import {
  IActor,
  Metadata,
  inject,
  Action,
  bindable,
  BubbleBus,
  diffArray,
  IBrokerBus,
  patchArray,
  Observable,
  TypeWrapBus,
  DSFindAction,
  Dependencies,
  PostDSAction,
  DSInsertAction,
  DSUpdateAction,
  DSRemoveAction,
  DEPENDENCIES_NS,
  DSFindAllAction,
  BaseActiveRecord,
  MainBusDependency,
  ActiveRecordCollection,
} from "@tandem/common";

import { FileCacheAction } from "./actions";
import { IFileSystem, IFileWatcher } from "./file-system";
import { FileSystemDependency } from "./dependencies";
import { WrapBus } from "mesh";
import { values } from "lodash";

interface IFileCacheItemData {
  filePath: string;
  url: string;
  metadata?: Object;
  mtime: number;
}

interface IFileCacheItemQuery {

  // absolute FS path to the file
  filePath?: string;

  // the url to the file path -- can also be a data url
  url?: string;
  metadata?: Object;
}

export class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {
  readonly idProperty = "filePath";

  @bindable()
  public url: string;

  @bindable()
  public mtime: number;

  @bindable()
  public filePath: string;

  @bindable()
  public metadata: Metadata;

  constructor(source: IFileCacheItemData, collectionName: string, private _fileSystem: IFileSystem, bus: IActor) {
    super(source, collectionName, bus);
  }

  serialize() {
    return {
      filePath : this.filePath,
      url      : this.url,
      mtime    : this.mtime,
      metadata : this.metadata.data
    };
  }

  save() {
    this.mtime = Date.now();
    return super.save();
  }

  setDataUrl(content: any, mimeType: string = "text/plain") {

    // TODO - may need to base64 encode this
    this.url = `data:${mimeType},${encodeURIComponent(content)}`;
    return this;
  }

  setFileUrl(url: string) {
    this.url = `file://${url}`;
    return this;
  }

  async read() {
    if (/^file:\/\//.test(this.url)) {
      return await this._fileSystem.readFile(this.url.substr("file://".length));
    } else {
      const response = await fetch(this.url);
      return await response.text();
    }
  }

  deserialize({ filePath, url, metadata, mtime }: IFileCacheItemData) {
    this.filePath = filePath;
    this.url      = url;
    this.mtime    = mtime;
    this.metadata = new Metadata(metadata);
  }
}

export interface IFileCacheWatcher {
  fileWatcher: IFileWatcher;
  entity: FileCacheItem;
}

export class FileCacheSynchronizer {
  private _watchers: any;

  constructor(private _cache: FileCache, private _bus: IBrokerBus, private _fileSystem: IFileSystem) {
    this._watchers = {};
    this._cache.observe(new WrapBus(this.update.bind(this)));
    this.update();
  }

  private update() {
    const a = Object.keys(this._watchers);
    const b = this._cache.collection.map((item) => item.filePath);
    const changes = diffArray(a, b, (a, b) => a === b);
    for (const { index, value } of changes.add) {
      this._watchers[value] = this._fileSystem.watchFile(value, this.onLocalFindChange.bind(this, value));
    }
    for (const value of changes.remove) {
      (<IFileWatcher>this._watchers[value]).dispose();
    }
  }

  private async onLocalFindChange(filePath: string) {
    const entity = await this._cache.item(filePath);

    // override any data urls that might be stored on the entity
    entity.setFileUrl(filePath).save();
  }
}

// TODO - move a lot of this logic to ActiveRecordCollection
// TODO - remove files here after TTL
export class FileCache extends Observable {
  private _bus: IBrokerBus;
  private _fileSystem: IFileSystem;
  private _synchronizer: FileCacheSynchronizer;
  readonly collection: ActiveRecordCollection<FileCacheItem, IFileCacheItemData>;

  constructor(@inject(DEPENDENCIES_NS) private _dependencies: Dependencies) {
    super();
    this._bus        = MainBusDependency.getInstance(_dependencies);
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IFileCacheItemData) => {
      return new FileCacheItem(source, this.collectionName, this._fileSystem, this._bus);
    });
    this.collection.load();
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
  }

  get collectionName() {
    return "fileCache";
  }

  async item(filePath: string): Promise<FileCacheItem> {
    return this.collection.findByUid(filePath) || await this.collection.create({
      filePath: filePath,
      url: "file://" + filePath,
      mtime: Date.now()
    }).save();
  }

  /**
   * watches local files for any changes. This is usually called
   * on the backend.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = new FileCacheSynchronizer(this, this._bus, this._fileSystem));
  }
}