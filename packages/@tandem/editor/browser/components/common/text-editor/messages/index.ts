import { CoreEvent } from "@tandem/common/messages";

export const SOURCE_CHANGE = "sourceChange";
export class SourceMetadataChangeEvent extends CoreEvent {
  constructor(readonly source: string) {
    super(SOURCE_CHANGE);
  }
}
