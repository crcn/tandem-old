import { Action } from "./base";

export { Action };

export interface Change {
  target: any;
  property: string;
  value: any;
  oldValue: any;
}

export const CHANGE = "change";
export class ChangeAction extends Action {
  constructor(readonly changes: Array<Change>) {
    super(CHANGE);
  }
}

export const LOAD = "load";
export class LoadAction extends Action {
  constructor() {
    super(LOAD);
  }
}

export const INITIALIZE = "initialize";
export class InitializeAction extends Action {
  constructor() {
    super(INITIALIZE);
  }
}

export const LOG        = "log";
export class LogAction extends Action {
  constructor(readonly level: number, readonly text: string) {
    super(LOG);
  }
}

export class DBAction extends Action {
  constructor(actionType: string, readonly collectionName: string) {
    super(actionType);
  }
}

export const INSERT = "insert";
export class InsertAction extends DBAction {
  constructor(collectionName: string, readonly data: any) {
    super(INSERT, collectionName);
  }
}

export const UPDATE = "update";
export class UpdateAction extends DBAction {
  constructor(collectionName: string, readonly data: any, readonly query: any) {
    super(UPDATE, collectionName);
  }
}

export const FIND   = "find";
export class FindAction extends DBAction {
  constructor(collectionName: string, readonly query: any, readonly multi: boolean = false) {
    super(FIND, collectionName);
  }
}

export class FindAllAction extends FindAction {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

export const REMOVE   = "remove";
export class RemoveAction extends DBAction {
  constructor(collectionName: string, readonly query: any) {
    super(REMOVE, collectionName);
  }
}

export const UPSERT = "upsert";
export class UpsertAction extends DBAction {
  constructor(collectionName: string, readonly data: any, readonly query: any) {
    super(UPSERT, collectionName);
  }
}

export const DID_INSERT = "didInsert";
export const DID_REMOVE = "didRemove";
export const DID_UPDATE = "didUpdate";
export class PostDBAction extends DBAction {

  constructor(type: string, collectionName: string, readonly data: any) {
    super(type, collectionName);
  }

  static createFromDBAction(action: InsertAction|UpdateAction|RemoveAction, data: any) {
    return new PostDBAction({
      [INSERT]: DID_INSERT,
      [UPDATE]: DID_UPDATE,
      [REMOVE]: DID_REMOVE
    }[action.type], action.collectionName, data);
  }
}

