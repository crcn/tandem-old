
import { PasteRequest, AddSyntheticObjectRequest } from "@tandem/editor/browser/messages";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { BaseEditorApplicationService } from "./base";
import {
  Logger,
  loggable,
  serialize,
  deserialize,
  InitializeApplicationRequest,
  ApplicationServiceProvider,
} from "@tandem/common";

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

const SYNTHETIC_OBJECT_MIME_TYPE = "text/x-synthetic-object";

export class ClipboardService extends BaseEditorApplicationService<IEditorBrowserConfig> {

  protected readonly logger: Logger;

  [InitializeApplicationRequest.INITIALIZE]() {
    document.addEventListener("copy", (event: ClipboardEvent) => {

      if (targetIsInput(event)) return;

      const content = JSON.stringify(this.editorStore.workspace.selection.map((item) => {
        return serialize(item); 
      }));

      event.clipboardData.setData(SYNTHETIC_OBJECT_MIME_TYPE, content);
      event.preventDefault();
    });

    document.addEventListener("paste", (event: any) => {
      Array.prototype.forEach.call(event.clipboardData.items, (item) => {
        this.bus.dispatch(new PasteRequest(item));
      });
    });
  }

  [PasteRequest.getRequestType(SYNTHETIC_OBJECT_MIME_TYPE)](request: PasteRequest) {
    request.item.getAsString((value) => {
      JSON.parse(value).forEach((serializedSyntheticObject) => {
        const item = deserialize(serializedSyntheticObject, this.kernel);
        this.bus.dispatch(new AddSyntheticObjectRequest(item));
      });
    });
  }
}

