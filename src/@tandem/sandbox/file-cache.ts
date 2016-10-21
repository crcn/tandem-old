import {
  IActor,
  Metadata,
  inject,
  Action,
  bindable,
  isMaster,
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
  DSFindAllAction,
  BaseActiveRecord,
  SingletonThenable,
  MainBusDependency,
  DependenciesDependency,
  ActiveRecordCollection,
} from "@tandem/common";

import { FileCacheAction } from "./actions";
import { IFileSystem, IFileWatcher } from "./file-system";
import { FileSystemDependency } from "./dependencies";
import { WrapBus } from "mesh";
import { values } from "lodash";
import * as fs from "fs";

interface IFileCacheItemData {
  _id?: string;
  filePath: string;
  url: string;
  updatedAt?: number;
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

  private _cache: any;

  @bindable()
  public updatedAt: number;

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
      updatedAt : this.updatedAt,
      filePath  : this.filePath,
      url       : this.url,
      mtime     : this.mtime,
      metadata  : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.url !== this.source.url || this.mtime !== this.source.mtime;
  }

  willSave() {
    this.updatedAt = Date.now();
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
    return this._cache || (this._cache = new SingletonThenable(this.read2.bind(this)));
  }

  private async read2() {
    if (/^file:\/\//.test(this.url)) {
      return await this._fileSystem.readFile(this.url.substr("file://".length));
    } else {
      const response = await fetch(this.url);
      return await response.text();
    }
  }

  shouldDeserialize(b: IFileCacheItemData) {
    return this.updatedAt < b.updatedAt;
  }

  setPropertiesFromSource({ filePath, updatedAt, url, metadata, mtime }: IFileCacheItemData) {
    this._cache   = undefined;
    this.filePath = filePath;
    this.url      = url;
    this.mtime    = mtime;
    this.updatedAt = updatedAt;
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
    this._cache.collection.observe(new WrapBus(this.update.bind(this)));
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
    entity.mtime = fs.lstatSync(filePath).mtime.getTime();

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

  constructor(@inject(DependenciesDependency.NS) private _dependencies: Dependencies) {
    super();
    this._bus        = MainBusDependency.getInstance(_dependencies);
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IFileCacheItemData) => {
      return new FileCacheItem(source, this.collectionName, this._fileSystem, this._bus);
    });
    this.collection.load();
    this.collection.sync();
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
  }

  get collectionName() {
    return "fileCache";
  }

  async item(filePath: string): Promise<FileCacheItem> {
    return this.collection.find((entity) => entity.filePath === filePath) || await this.collection.create({
      filePath: filePath,
      url: "file://" + filePath,
      mtime: Date.now()
    }).insert();
  }

  /**
   * watches local files for any changes. This is usually called
   * on the backend.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = new FileCacheSynchronizer(this, this._bus, this._fileSystem));
  }
}