import { Action } from "./base";
import { IDispatcher, IStreamableDispatcher, DuplexStream, readOneChunk } from "@tandem/mesh";
import { File } from "../models";

export * from "./base";
export * from "./core";
export * from "./mutate";

export class ActiveRecordEvent extends Action {
  static readonly ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
}
