import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { Action, InitializeAction } from "@tandem/common";

export class DNDService extends CoreApplicationService<IEditorBrowserConfig> {
  [InitializeAction.INITIALIZE](action: Action) {
  }
}