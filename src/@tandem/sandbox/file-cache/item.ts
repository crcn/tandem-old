import memoize =  require("memoizee");
import { CallbackDispatcher } from "@tandem/mesh";
import { IFileSystem } from "@tandem/sandbox/file-system";
import { btoa, atob } from "abab"

import {
  Metadata,
  bindable,
  ENV_IS_NODE,
  MutationEvent,
  BaseActiveRecord,
  PropertyMutation,
} from "@tandem/common";

export interface IFileCacheItemData {
  _id?: string;
  sourceUri: string;
  contentUri: string;
  sourceModifiedAt?: number;
  updatedAt?: number;
  metadata?: Object;
}

export function createDataUrl(content: Buffer|string, mimeType: string = "text/plain") {
  
  if (!(content instanceof Buffer)) {
      content = new Buffer(content, "utf8");
    }

  return `data:${mimeType},${content.toString("base64")}`;
}

let _i = 0;

// TODO - filePath should be sourceUrl to enable different protocols such as urls
export class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {

  readonly idProperty = "filePath";

  @bindable(true)
  public updatedAt: number;

  @bindable(true)
  public sourceModifiedAt: number;

  @bindable(true)
  public contentUri: string;

  @bindable(true)
  public sourceUri: string;

  @bindable(true)
  public metadata: Metadata;

  private _rawDataUrlContent: any;

  constructor(source: IFileCacheItemData, collectionName: string, private _fileSystem: IFileSystem) {
    super(source, collectionName);
    this.observe(new CallbackDispatcher(this.onAction.bind(this)));
  }

  serialize() {
    return {
      updatedAt  : this.updatedAt,
      sourceUri  : this.sourceUri,
      sourceModifiedAt: this.sourceModifiedAt,
      contentUri  : this.contentUri,
      metadata    : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.contentUri !== this.sourceUri || this.sourceModifiedAt !== this.source.sourceModifiedAt;
  }

  willSave() {
    this.updatedAt = Date.now();
  }

  setDataUrlContent(content: string|Buffer, mimeType: string = "text/plain") {
    return this.setContentUri(createDataUrl(content, mimeType));
  }

  setContentUri(uri: string) {
    this.contentUri = uri;
    return this;
  }

  read = memoize(async () => {
    if (/^file:\/\//.test(this.contentUri)) {
      return await this._fileSystem.readFile(this.contentUri.substr("file://".length));
    } else {

      // pollyfills don't work for data uris in Node.JS. Need to PR node-fetch for that. Quick
      // fix or bust for now.
      if (ENV_IS_NODE) {
        const data = parseDataURI(this.contentUri);
        if (!data) throw new Error(`Cannot load ${this.contentUri}.`);
        return new Buffer(data.content, "base64");
      }

      const response = await fetch(this.contentUri);
      return await response.text();
    }
  }, { promise: true, length: 0 })

  shouldDeserialize(b: IFileCacheItemData) {
    return this.updatedAt < b.updatedAt;
  }

  setPropertiesFromSource({ sourceUri, updatedAt, contentUri, metadata, sourceModifiedAt }: IFileCacheItemData) {
    this.sourceUri           = sourceUri;
    this.contentUri          = contentUri;
    this.updatedAt           = updatedAt;
    this.metadata            = new Metadata(metadata);
    this.sourceModifiedAt = sourceModifiedAt;
  }

  private onAction({ mutation }: MutationEvent<any>) {
    if (mutation && mutation.type === PropertyMutation.PROPERTY_CHANGE) {
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