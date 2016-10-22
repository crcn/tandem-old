import { ISynthetic } from "./synthetic";
import { EditAction, IContentEdit } from "./editor2";

export interface IPatcher {
  diff(oldTarget: ISynthetic, newTarget: ISynthetic): EditAction[];
  patch(target: ISynthetic, actions: EditAction[]);
}