import { IStreamableDispatcher } from "@tandem/mesh";
import { Observable } from "@tandem/common";

export class EditorMasterStore extends Observable {
  readonly channels: {
    [Identifer: string]: IStreamableDispatcher<any>
  } = {};
}