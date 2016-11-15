import { Action } from "./base";
import { definePublicAction } from "./core";
import { IDispatcher, IStreamableDispatcher, DuplexStream, readOneChunk } from "@tandem/mesh";
import { File } from "../models";

export * from "./base";
export * from "./core";

@definePublicAction()
export class GetPrimaryProjectFilePathAction extends Action {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async dispatch(dispatcher: IStreamableDispatcher<any>): Promise<string> {
    return (await readOneChunk(dispatcher.dispatch(new GetPrimaryProjectFilePathAction()))).value;
  }
}

export class EntityAction extends Action {
  static readonly ENTITY_STALE = "entityStale";
  static readonly ENTITY_DIRTY = "entityDirty";
}

export class ActiveRecordAction extends Action {
  static readonly ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
}
