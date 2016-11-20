import { Action } from "@tandem/common/messages";

export const SOURCE_CHANGE = "sourceChange";
export class SourceMetadataChangeEvent extends Action {
  constructor(readonly source: string) {
    super(SOURCE_CHANGE);
  }
}
