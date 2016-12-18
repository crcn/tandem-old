import { CoreEvent } from "@tandem/common/messages";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";

export class KeyBinding {
  constructor(readonly key: string|Array<any>, readonly message: CoreEvent) { }
}