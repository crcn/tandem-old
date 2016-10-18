import {
  IActor,
  Metadata,
  inject,
  bindable,
  Action,
  DSFindAction,
  Dependencies,
  diffArray,
  patchArray,
  DSInsertAction,
  DSFindAllAction,
  BubbleBus,
  DSUpdateAction,
  DSRemoveAction,
  DEPENDENCIES_NS,
  IBrokerBus,
  TypeWrapBus,
  Observable,
  MainBusDependency,
  BaseActiveRecord,
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
    const b = this._cache.loadedItems.map((item) => item.filePath);
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
  private _entities: any;
  private _synchronizer: FileCacheSynchronizer;
  private _globalActionObserver: IActor;

  constructor(@inject(DEPENDENCIES_NS) private _dependencies: Dependencies) {
    super();
    this._bus        = MainBusDependency.getInstance(_dependencies);
    this._entities   = {};
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this._globalActionObserver = new WrapBus(this.onGlobalAction.bind(this));
  }

  get collectionName() {
    return "fileCache";
  }

  async item(filePath: string): Promise<FileCacheItem> {
    return await this.findCacheItem(filePath) || await this.insertFileCacheItem(filePath);
  }

  get loadedItems(): FileCacheItem[] {
    return values<FileCacheItem>(this._entities);
  }

  /**
   * watches local files for any changes. This is usually called
   * on the backend.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = new FileCacheSynchronizer(this, this._bus, this._fileSystem));
  }

  private async findCacheItem(filePath: string): Promise<FileCacheItem> {
    if (this._entities[filePath]) return this._entities[filePath];
    const { value } = await this._bus.execute(new DSFindAction<IFileCacheItemQuery>(this.collectionName, {
      filePath: filePath
    }, false)).read();
    return value && this._updateEntity(value);
  }

  private onGlobalAction(action: DSUpdateAction<IFileCacheItemData, any>|DSInsertAction<IFileCacheItemData>) {
    if ((action.type === DSUpdateAction.DS_UPDATE || action.type === DSInsertAction.DS_INSERT) && action.collectionName === this._entities.collectionName) {
      this._updateEntity(action.data);
    }
  }

  private async insertFileCacheItem(filePath: string): Promise<FileCacheItem> {
    return this._updateEntity((await this._bus.execute(new DSInsertAction<IFileCacheItemData>(this.collectionName, {
      filePath: filePath,
      url: "file://" + filePath,
      mtime: Date.now()
    })).read()).value);
  }

  private _updateEntity(source: IFileCacheItemData) {

    if (this._entities[source.filePath]) {
      const entity = this._entities[source.filePath];
      entity.deserialize(source);
      return entity;
    }
    const entity = this._entities[source.filePath] = new FileCacheItem(source, this.collectionName, this._fileSystem, this._bus);
    this.notify(new FileCacheAction(FileCacheAction.ADDED_ENTITY, entity));
    entity.observe(new BubbleBus(this));
    return entity;
  }
}