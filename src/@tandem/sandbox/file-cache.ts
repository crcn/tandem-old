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
  ENV_IS_NODE,
  PostDSAction,
  DSInsertAction,
  DSUpdateAction,
  DSRemoveAction,
  DSFindAllAction,
  BaseActiveRecord,
  SingletonThenable,
  PrivateBusDependency,
  DependenciesDependency,
  ActiveRecordCollection,
} from "@tandem/common";

import { FileCacheAction } from "./actions";
import { IFileSystem, IFileWatcher } from "./file-system";
import { FileSystemDependency } from "./dependencies";
import { WrapBus } from "mesh";
import { values } from "lodash";
import * as fs from "fs";

export interface IFileCacheItemData {
  _id?: string;
  filePath: string;
  url: string;
  localFileModifiedAt?: number;
  updatedAt?: number;
  metadata?: Object;
}

export interface IFileCacheItemQuery {

  // absolute FS path to the file
  filePath?: string;

  // the url to the file path -- can also be a data url
  url?: string;
  metadata?: Object;
}

export class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {

  readonly idProperty = "filePath";

  private _cache: any;

  @bindable(true)
  public updatedAt: number;

  @bindable(true)
  public localFileModifiedAt: number;

  @bindable(true)
  public url: string;

  @bindable(true)
  public filePath: string;

  @bindable(true)
  public metadata: Metadata;

  constructor(source: IFileCacheItemData, collectionName: string, private _fileSystem: IFileSystem, bus: IActor) {
    super(source, collectionName, bus);
  }

  serialize() {
    return {
      updatedAt : this.updatedAt,
      filePath  : this.filePath,
      localFileModifiedAt: this.localFileModifiedAt,
      url       : this.url,
      metadata  : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.url !== this.source.url || this.localFileModifiedAt !== this.source.localFileModifiedAt;
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
    this._cache = undefined;
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

      // pollyfills don't work for data uris in Node.JS. Need to PR node-fetch for that. Quick
      // fix or bust for now.
      if (ENV_IS_NODE) {
        const data = parseDataURI(this.url);
        if (!data) throw new Error(`Cannot load ${this.url}.`);
        return decodeURIComponent(data.content);
      }

      const response = await fetch(this.url);
      return await response.text();
    }
  }

  shouldDeserialize(b: IFileCacheItemData) {
    return this.updatedAt < b.updatedAt;
  }

  setPropertiesFromSource({ filePath, updatedAt, url, metadata, localFileModifiedAt }: IFileCacheItemData) {
    this._cache    = undefined;
    this.filePath  = filePath;
    this.url       = url;
    this.updatedAt = updatedAt;
    this.localFileModifiedAt = localFileModifiedAt;
    this.metadata  = new Metadata(metadata);
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
    entity.localFileModifiedAt = fs.lstatSync(filePath).mtime.getTime();

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

  constructor(@inject(DependenciesDependency.ID) private _dependencies: Dependencies) {
    super();
    this._bus        = PrivateBusDependency.getInstance(_dependencies);
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IFileCacheItemData) => {
      return new FileCacheItem(source, this.collectionName, this._fileSystem, this._bus);
    });
    this.collection.load();
    this.collection.sync();
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
  }

  eagerFindByFilePath(filePath) {
    return this.collection.find(item => item.filePath === filePath);
  }

  get collectionName() {
    return "fileCache";
  }

  async item(filePath: string): Promise<FileCacheItem> {
    return this.collection.find((entity) => entity.filePath === filePath) || await this.collection.create({
      filePath: filePath,
      url: "file://" + filePath
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

function parseDataURI(uri: string): { type: string, content: string } {
  const parts = uri.match(/data:(.*?),(.*)/);
  return parts && { type: parts[1], content: parts[2] };
}