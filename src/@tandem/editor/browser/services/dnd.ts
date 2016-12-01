import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreEvent, InitializeApplicationRequest } from "@tandem/common";

export class DNDService extends CoreApplicationService<IEditorBrowserConfig> {
  [InitializeApplicationRequest.INITIALIZE](action: CoreEvent) {
  }
}