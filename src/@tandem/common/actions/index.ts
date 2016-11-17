import { Action } from "./base";
import { IDispatcher, IStreamableDispatcher, DuplexStream, readOneChunk } from "@tandem/mesh";
import { File } from "../models";

export * from "./base";
export * from "./core";



export class EntityAction extends Action {
  static readonly ENTITY_STALE = "entityStale";
  static readonly ENTITY_DIRTY = "entityDirty";
}

export class ActiveRecordAction extends Action {
  static readonly ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
}
