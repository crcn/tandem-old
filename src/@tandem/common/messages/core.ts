import * as sift from "sift";
import { Action } from "./base";
import { ITreeNode } from "@tandem/common/tree";
import { IDisposable } from "@tandem/common/object";
import { serializable, ISerializer } from "@tandem/common/serialize";
import {  DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest, DSMessage } from "@tandem/mesh/ds";

export { Action };

export class MetadataChangeAction extends Action {
  static readonly CHANGE = "change";
  constructor() {
    super(MetadataChangeAction.CHANGE);
  }
}

export class DisposeEvent extends Action {
  static readonly DISPOSE = "dispose";
  constructor() {
    super(DisposeEvent.DISPOSE);
  }
}

export class PropertyChangeEvent extends Action {
  static readonly PROPERTY_CHANGE = "propertyChange";
  constructor(readonly property: string, readonly newValue: any, readonly oldValue: any, bubbles: boolean = false) {
    super(PropertyChangeEvent.PROPERTY_CHANGE, bubbles);
  }
}

export class LoadRequest extends Action {
  static readonly LOAD = "load";
  constructor() {
    super(LoadRequest.LOAD);
  }
}

export class InitializeRequest extends Action {
  static readonly INITIALIZE = "initialize";
  constructor() {
    super(InitializeRequest.INITIALIZE);
  }
}

export class DSUpsertRequest<T> extends DSMessage {
  static readonly DS_UPSERT = "dsUpsert";
  constructor(collectionName: string, readonly data: any, readonly query: T) {
    super(DSUpsertRequest.DS_UPSERT, collectionName);
  }
}

export class PostDSMessage extends DSMessage {

  static readonly DS_DID_INSERT = "dsDidInsert";
  static readonly DS_DID_REMOVE = "dsDidRemove";
  static readonly DS_DID_UPDATE = "dsDidUpdate";

  constructor(type: string, collectionName: string, readonly data: any, readonly timestamp: number) {
    super(type, collectionName);
  }

  static createFromDSAction(action: DSInsertRequest<any>|DSUpdateRequest<any, any>|DSRemoveRequest<any>, data: any) {
    return new PostDSMessage({
      [DSInsertRequest.DS_INSERT]: PostDSMessage.DS_DID_INSERT,
      [DSUpdateRequest.DS_UPDATE]: PostDSMessage.DS_DID_UPDATE,
      [DSRemoveRequest.DS_REMOVE]: PostDSMessage.DS_DID_REMOVE
    }[action.type], action.collectionName, data, action.timestamp);
  }
}

export const ATTRIBUTE_CHANGE = "attributeChange";
export class AttributeMetadataChangeEvent extends Action {
  constructor(readonly key: string, readonly value: string) {
    super(ATTRIBUTE_CHANGE);
  }
}

export class MetadataChangeEvent extends Action {
  static readonly METADATA_CHANGE = "metadataChange";
  constructor(readonly key: string, readonly value: string) {
    super(MetadataChangeEvent.METADATA_CHANGE);
  }
}
