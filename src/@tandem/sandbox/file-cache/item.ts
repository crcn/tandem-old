import * as memoize from "memoizee";
import { CallbackDispatcher } from "@tandem/mesh";
import { IFileSystem } from "@tandem/sandbox/file-system";
import { btoa, atob } from "abab"

import {
  Action,
  Metadata,
  bindable,
  ENV_IS_NODE,
  BaseActiveRecord,
  PropertyChangeEvent,
} from "@tandem/common";

export interface IFileCacheItemData {
  _id?: string;
  filePath: string;
  url: string;
  sourceFileModifiedAt?: number;
  updatedAt?: number;
  metadata?: Object;
}

let _i = 0;

// TODO - filePath should be sourceUrl to enable different protocols such as urls
export class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {

  readonly idProperty = "filePath";

  @bindable(true)
  public updatedAt: number;

  @bindable(true)
  public sourceFileModifiedAt: number;

  @bindable(true)
  public url: string;

  @bindable(true)
  public filePath: string;

  @bindable(true)
  public metadata: Metadata;

  private _i: number;

  constructor(source: IFileCacheItemData, collectionName: string, private _fileSystem: IFileSystem) {
    super(source, collectionName);
    this.observe(new CallbackDispatcher(this.onAction.bind(this)));
    this._i = _i++;
  }

  serialize() {
    return {
      updatedAt : this.updatedAt,
      filePath  : this.filePath,
      sourceFileModifiedAt: this.sourceFileModifiedAt,
      url       : this.url,
      metadata  : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.url !== this.source.url || this.sourceFileModifiedAt !== this.source.sourceFileModifiedAt;
  }

  willSave() {
    this.updatedAt = Date.now();
  }

  setDataUrlContent(content: any, mimeType: string = "text/plain") {

    if (!(content instanceof Buffer)) {
      content = new Buffer(content, "utf8");
    }

    this.url = `data:${mimeType},${content.toString("base64")}`;
    return this;
  }

  setFileUrl(url: string) {
    this.url = `file://${url}`;
    return this;
  }

  read = memoize(async () => {
    if (/^file:\/\//.test(this.url)) {
      return await this._fileSystem.readFile(this.url.substr("file://".length));
    } else {

      // pollyfills don't work for data uris in Node.JS. Need to PR node-fetch for that. Quick
      // fix or bust for now.
      if (ENV_IS_NODE) {
        const data = parseDataURI(this.url);
        if (!data) throw new Error(`Cannot load ${this.url}.`);
        return new Buffer(data.content, "base64");
      }

      const response = await fetch(this.url);
      return await response.text();
    }
  }, { promise: true, length: 0 })

  shouldDeserialize(b: IFileCacheItemData) {
    return this.updatedAt < b.updatedAt;
  }

  setPropertiesFromSource({ filePath, updatedAt, url, metadata, sourceFileModifiedAt }: IFileCacheItemData) {
    this.filePath            = filePath;
    this.url                 = url;
    this.updatedAt           = updatedAt;
    this.metadata            = new Metadata(metadata);
    this.sourceFileModifiedAt = sourceFileModifiedAt;
  }

  private onAction(action: Action) {
    if (action.type === PropertyChangeEvent.PROPERTY_CHANGE) {
      this.clearCache();
    }
  }

  private clearCache() {
    this.read["clear"]();
  }
}


function parseDataURI(uri: string): { type: string, content: string } {
  const parts = uri.match(/data:(.*?),(.*)/);
  return parts && { type: parts[1], content: parts[2] };
}