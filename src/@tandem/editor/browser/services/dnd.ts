import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { Action, InitializeRequest } from "@tandem/common";

export class DNDService extends CoreApplicationService<IEditorBrowserConfig> {
  [InitializeRequest.INITIALIZE](action: Action) {
  }
}