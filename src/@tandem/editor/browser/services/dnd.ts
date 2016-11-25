import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreEvent, InitializeRequest } from "@tandem/common";

export class DNDService extends CoreApplicationService<IEditorBrowserConfig> {
  [InitializeRequest.INITIALIZE](action: CoreEvent) {
  }
}