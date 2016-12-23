
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

function targetIsInput(element: HTMLElement) {
  return /input|textarea/i.test(element.tagName);
}

const SYNTHETIC_OBJECT_MIME_TYPE = "text/x-synthetic-object";

export class ClipboardService extends BaseEditorApplicationService<IEditorBrowserConfig> {

  protected readonly logger: Logger;

  [InitializeApplicationRequest.INITIALIZE]() {
    document.addEventListener("copy", (event: ClipboardEvent) => {

      // event target may come from iframe. event target in this case will always be iframe, so
      // inspect the active element's (which is the iframe in this case again) active element to 
      // ensure that it isn't an input.
      if (document.activeElement && document.activeElement.tagName === "IFRAME") {
        if (targetIsInput((document.activeElement as HTMLIFrameElement).contentDocument.activeElement as HTMLElement)) {
          return;
        }
      }

      if (targetIsInput(event.target as HTMLElement)) return;

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

