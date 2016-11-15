import * as sift from "sift";
import { Action } from "./base";
import {  DSFind, DSInsert, DSRemove, DSUpdate } from "@tandem/mesh/ds";
import { ITreeNode } from "@tandem/common/tree";
import { IDisposable } from "@tandem/common/object";
import { serializable, ISerializer } from "@tandem/common/serialize";
export { Action };

export namespace ActionAccess {
  export const PUBLIC    = "public";
  export const PRIVATE   = "private";
  export const PROTECTED = "protected";
}

export function getActionAccess(action: Action) {
  return Reflect.getMetadata("action:access", action.constructor);
}

function defineActionAccess(value: string, serializer?: ISerializer<any, any>) {
  return function(target) {
    serializable(serializer)(target);
    Reflect.defineMetadata("action:access", value, target);
  }
}

export function definePublicAction(serializer?: ISerializer<any, any>) {
  return defineActionAccess(ActionAccess.PUBLIC, serializer);
}

export function defineProtectedAction() {
  return defineActionAccess(ActionAccess.PROTECTED);
}

export function definePrivateAction() {
  return defineActionAccess(ActionAccess.PRIVATE);
}

export function isPublicAction(action: Action) {
  return getActionAccess(action) === ActionAccess.PUBLIC;
}

export function isPrivateAction(action: Action) {
  const access = getActionAccess(action);

  // private by default
  return !access || access === ActionAccess.PRIVATE;
}

export function defineMasterAction() {
  return function(target) {
    serializable()(target);
    Reflect.defineMetadata("masterAction", true, target);
  }
}

export function isMasterAction(action: Action) {
  return Reflect.getMetadata("masterAction", action.constructor) === true;
}

export function defineWorkerAction() {
  return function(target) {
    serializable()(target);
    Reflect.defineMetadata("workerAction", true, target);
  }
}

export function isWorkerAction(action: Action) {
  return Reflect.getMetadata("workerAction", action.constructor) === true;
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

@definePublicAction()
export class DSAction extends Action {
  readonly timestamp: number = Date.now();
  constructor(actionType: string, readonly collectionName: string) {
    super(actionType);
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

  static createFromDSAction(action: DSInsert<any>|DSUpdate<any, any>|DSRemove<any>, data: any) {
    return new PostDSAction({
      [DSInsert.DS_INSERT]: PostDSAction.DS_DID_INSERT,
      [DSUpdate.DS_UPDATE]: PostDSAction.DS_DID_UPDATE,
      [DSRemove.DS_REMOVE]: PostDSAction.DS_DID_REMOVE
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
