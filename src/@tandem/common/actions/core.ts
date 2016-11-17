import * as sift from "sift";
import { Action } from "./base";
import {  DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest, DSMessage } from "@tandem/mesh/ds";
import { ITreeNode } from "@tandem/common/tree";
import { IDisposable } from "@tandem/common/object";
import { serializable, ISerializer } from "@tandem/common/serialize";
export { Action };

export class ChangeAction extends Action {
  static readonly CHANGE = "change";
  constructor() {
    super(ChangeAction.CHANGE);
  }
}

export class DisposeAction extends Action {
  static readonly DISPOSE = "dispose";
  constructor() {
    super(DisposeAction.DISPOSE);
  }
}

export class RemoveAction extends Action {
  static readonly REMOVE = "remove";
  constructor() {
    super(RemoveAction.REMOVE);
  }
}

export class PropertyChangeAction extends Action {
  static readonly PROPERTY_CHANGE = "propertyChange";
  constructor(readonly property: string, readonly newValue: any, readonly oldValue: any, bubbles: boolean = false) {
    super(PropertyChangeAction.PROPERTY_CHANGE, bubbles);
  }
}

export class SettingChangeAction extends Action {
  static readonly SETTING_CHANGE = "settingChange";
  constructor(readonly property: string, readonly newValue: any, readonly oldValue: any) {
    super(SettingChangeAction.SETTING_CHANGE);
  }
}

export class LoadAction extends Action {
  static readonly LOAD = "load";
  constructor() {
    super(LoadAction.LOAD);
  }
}

export class InitializeAction extends Action {
  static readonly INITIALIZE = "initialize";
  constructor() {
    super(InitializeAction.INITIALIZE);
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
export class AttributeChangeAction extends Action {
  constructor(readonly key: string, readonly value: string) {
    super(ATTRIBUTE_CHANGE);
  }
}

export class MetadataChangeAction extends Action {
  static readonly METADATA_CHANGE = "metadataChange";
  constructor(readonly key: string, readonly value: string) {
    super(MetadataChangeAction.METADATA_CHANGE);
  }
}

export const UPDATE = "update";
export class UpdateAction extends Action {
  constructor() {
    super(UPDATE);
  }
}
