import { Action } from "sf-core/actions";

export const SOURCE_CHANGE = "sourceChange";
export class SourceChangeAction extends Action {
  constructor(readonly source: string) {
    super(SOURCE_CHANGE);
  }
}