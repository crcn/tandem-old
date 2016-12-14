import memoize =  require("memoizee");
import { CallbackDispatcher } from "@tandem/mesh";
import { btoa, atob } from "abab"
import { URIProtocolProvider, URIProtocol, IURIProtocolReadResult  } from "../uri";

import {
  Metadata,
  bindable,
  Injector,
  inject,
  ENV_IS_NODE,
  MutationEvent,
  MimeTypeProvider,
  BaseActiveRecord,
  InjectorProvider,
  PropertyMutation,
} from "@tandem/common";

export interface IFileCacheItemData {
  _id?: string;
  sourceUri: string;
  contentUri: string;
  synchronized?: boolean
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

  readonly idProperty = "sourceUri";

  @inject(InjectorProvider.ID)
  private _injector: Injector;

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

  constructor(source: IFileCacheItemData, collectionName: string) {
    super(source, collectionName);
    this.observe(new CallbackDispatcher(this.onAction.bind(this)));
  }
  
  get synchronized() {
    return this.sourceUri === this.contentUri;
  }

  serialize() {
    return {
      updatedAt  : this.updatedAt,
      sourceUri  : this.sourceUri,
      sourceModifiedAt: this.sourceModifiedAt,
      contentUri  : this.contentUri,
      synchronized : this.synchronized, 
      metadata    : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.source.contentUri !== this.contentUri || this.sourceModifiedAt !== this.source.sourceModifiedAt;
  }

  willSave() {
    this.updatedAt = Date.now();
  }

  setDataUrlContent(content: string|Buffer, mimeType?: string)  {
    return this.setContentUri(createDataUrl(content, mimeType || MimeTypeProvider.lookup(this.sourceUri, this._injector)));
  }

  setContentUri(uri: string) {
    this.contentUri = uri;
    return this;
  }

  read = memoize(async () => {
    const protocol = URIProtocolProvider.lookup(this.contentUri, this._injector);
    return await protocol.read(this.contentUri);
  }, { promise: true, length: 0 }) as (() => Promise<IURIProtocolReadResult>);

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

