import { Action } from "./base";
import { IActor } from "tandem-common/actors";
import { ITreeNode } from "tandem-common/tree";
import { IDisposable } from "tandem-common/object";
export { Action };

export interface Change {
  target: any;
  property: string;
  value: any;
  oldValue: any;
}

export class TreeNodeAction extends Action {
  static readonly NODE_ADDED    = "nodeAdded";
  static readonly NODE_REMOVED  = "nodeRemoved";
}

export class ChangeAction extends Action {
  static readonly CHANGE = "change";
  constructor(readonly changes: Array<Change>) {
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
  constructor(readonly property: string, readonly newValue: any, readonly oldValue: any) {
    super(PropertyChangeAction.PROPERTY_CHANGE);
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

export class DSAction extends Action {
  readonly timestamp: number = Date.now();
  constructor(actionType: string, readonly collectionName: string) {
    super(actionType);
  }
}

export class DSInsertAction extends DSAction {
  static readonly DS_INSERT = "dsInsert";
  constructor(collectionName: string, readonly data: any) {
    super(DSInsertAction.DS_INSERT, collectionName);
  }
  static async execute({ collectionName, data }: { collectionName: string, data: any }, bus: IActor) {
    return await bus.execute(new DSInsertAction(collectionName, data)).readAll();
  }
}

export class DSUpdateAction extends DSAction {
  static readonly DS_UPDATE = "dsUpdate";
  constructor(collectionName: string, readonly data: any, readonly query: any) {
    super(DSUpdateAction.DS_UPDATE, collectionName);
  }

  static async execute(collectionName: string, data: any, query: any, bus: IActor): Promise<Array<any>> {
    return await bus.execute(new DSUpdateAction(collectionName, data, query)).readAll();
  }
}

export class DSFindAction extends DSAction {
  static readonly DS_FIND   = "dsFind";
  constructor(collectionName: string, readonly query: any, readonly multi: boolean = false) {
    super(DSFindAction.DS_FIND, collectionName);
  }
}

export class DSFindAllAction extends DSFindAction {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

export class DSRemoveAction extends DSAction {
  static readonly DS_REMOVE   = "dsRemove";
  constructor(collectionName: string, readonly query: any) {
    super(DSRemoveAction.DS_REMOVE, collectionName);
  }
}

export class DSUpsertAction extends DSAction {
  static readonly DS_UPSERT = "dsUpsert";
  constructor(collectionName: string, readonly data: any, readonly query: any) {
    super(DSUpsertAction.DS_UPSERT, collectionName);
  }
}

export class PostDSAction extends DSAction {

  static readonly DS_DID_INSERT = "dsDidInsert";
  static readonly DS_DID_REMOVE = "dsDidRemove";
  static readonly DS_DID_UPDATE = "dsDidUpdate";

  constructor(type: string, collectionName: string, readonly data: any, readonly timestamp: number) {
    super(type, collectionName);
  }

  static createFromDSAction(action: DSInsertAction|DSUpdateAction|DSRemoveAction, data: any) {
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

export const METADATA_CHANGE = "metadataChange";
export class MetadataChangeAction extends Action {
  constructor(readonly key: string, readonly value: string) {
    super(METADATA_CHANGE);
  }
}

export const UPDATE = "update";
export class UpdateAction extends Action {
  constructor() {
    super(UPDATE);
  }
}

export interface IReadFileActionResponseData {
  path: string;
  content: string;
  mtime: number;
}

export interface IFileModelActionResponseData extends IReadFileActionResponseData {

}


export class OpenFileAction extends Action {
  static readonly OPEN_FILE = "openFile";
  constructor(readonly path: string) {
    super(OpenFileAction.OPEN_FILE);
  }

  static async execute(action: { path: string }, bus: IActor): Promise<IFileModelActionResponseData> {
    return (await bus.execute(new OpenFileAction(action.path)).read()).value;
  }
}


export class ReadFileAction extends Action {
  static readonly READ_FILE = "readFile";
  constructor(readonly path: string) {
    super(ReadFileAction.READ_FILE);
  }

  static async execute({ path }: { path: string }, bus: IActor): Promise<IReadFileActionResponseData> {
    return (await bus.execute(new ReadFileAction(path)).read()).value;
  }
}

export class UpdateTemporaryFileContentAction extends Action {
  static readonly UPDATE_TEMP_FILE_CONTENT = "updateTemporyFileContent";
  constructor(readonly path: string, readonly content: string) {
    super(UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT);
  }

  static async execute({ path, content }, bus: IActor) {
    return (await bus.execute(new UpdateTemporaryFileContentAction(path, content)).read()).value;
  }
}

export class WatchFileAction extends Action {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly path: string) {
    super(WatchFileAction.WATCH_FILE);
  }

  static execute(path: string, bus: IActor, onFileChange: Function): IDisposable {
    const stream = bus.execute(new WatchFileAction(path));

    stream.pipeTo({
      abort: () => {},
      close: () => {},
      write: onFileChange
    });

    return {
      dispose: () => stream.cancel()
    };
  }
}

