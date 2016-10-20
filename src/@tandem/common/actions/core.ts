import * as sift from "sift";
import { Action } from "./base";
import { IActor } from "@tandem/common/actors";
import { ITreeNode } from "@tandem/common/tree";
import { IDisposable } from "@tandem/common/object";
export { Action };

export function definePublicAction() {
  return function(target) {
    Reflect.defineMetadata("remoteAction", true, target);
  }
}

export function isPublicAction(action: Action) {
  return Reflect.getMetadata("remoteAction", action.constructor) === true;
}

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
  constructor(readonly property: string, readonly newValue: any, readonly oldValue: any, bubbles?: boolean) {
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

export class LogAction extends Action {
  static readonly LOG        = "log";
  constructor(readonly level: number, readonly text: string) {
    super(LogAction.LOG);
  }
}

@definePublicAction()
export class DSAction extends Action {
  readonly timestamp: number = Date.now();
  constructor(actionType: string, readonly collectionName: string) {
    super(actionType);
  }
}

export class DSInsertAction<T> extends DSAction {
  static readonly DS_INSERT = "dsInsert";
  constructor(collectionName: string, readonly data: T) {
    super(DSInsertAction.DS_INSERT, collectionName);
  }
  static async execute(collectionName: string, data: any, bus: IActor) {
    return await bus.execute(new DSInsertAction(collectionName, data)).readAll();
  }
}

export class DSUpdateAction<T, U> extends DSAction {
  static readonly DS_UPDATE = "dsUpdate";
  constructor(collectionName: string, readonly data: T, readonly query: U) {
    super(DSUpdateAction.DS_UPDATE, collectionName);
  }

  static async execute(collectionName: string, data: any, query: any, bus: IActor): Promise<Array<any>> {
    return await bus.execute(new DSUpdateAction(collectionName, data, query)).readAll();
  }
}

export class DSFindAction<T> extends DSAction {
  static readonly DS_FIND   = "dsFind";
  constructor(collectionName: string, readonly query: T, readonly multi: boolean = false) {
    super(DSFindAction.DS_FIND, collectionName);
  }
  static createFilter(collectionName: string) {
    return sift({ collectionName: collectionName });
  }
  static async findOne(collectionName: string, query: Object, bus: IActor): Promise<any> {
    return (await bus.execute(new DSFindAction(collectionName, query, true)).read()).value;
  }
  static async findMulti(collectionName: string, query: Object, bus: IActor): Promise<any[]> {
    return await bus.execute(new DSFindAction(collectionName, query, true)).readAll();
  }
}

export class DSFindAllAction extends DSFindAction<any> {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

export class DSRemoveAction<T> extends DSAction {
  static readonly DS_REMOVE   = "dsRemove";
  constructor(collectionName: string, readonly query: T) {
    super(DSRemoveAction.DS_REMOVE, collectionName);
  }
}

export class DSUpsertAction<T> extends DSAction {
  static readonly DS_UPSERT = "dsUpsert";
  constructor(collectionName: string, readonly data: any, readonly query: T) {
    super(DSUpsertAction.DS_UPSERT, collectionName);
  }
}

@definePublicAction()
export class PostDSAction extends DSAction {

  static readonly DS_DID_INSERT = "dsDidInsert";
  static readonly DS_DID_REMOVE = "dsDidRemove";
  static readonly DS_DID_UPDATE = "dsDidUpdate";

  constructor(type: string, collectionName: string, readonly data: any, readonly timestamp: number) {
    super(type, collectionName);
  }

  static createFromDSAction(action: DSInsertAction<any>|DSUpdateAction<any, any>|DSRemoveAction<any>, data: any) {
    return new PostDSAction({
      [DSInsertAction.DS_INSERT]: PostDSAction.DS_DID_INSERT,
      [DSUpdateAction.DS_UPDATE]: PostDSAction.DS_DID_UPDATE,
      [DSRemoveAction.DS_REMOVE]: PostDSAction.DS_DID_REMOVE
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
