
import { PasteAction } from "@tandem/editor/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import {
  Logger,
  loggable,
  serialize,
  InitializeAction,
  BaseApplicationService,
  ApplicationServiceDependency,
} from "@tandem/common";

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable()
export default class ClipboardService extends BaseApplicationService<FrontEndApplication> {

  public logger: Logger;

  [InitializeAction.INITIALIZE]() {
    // document.addEventListener("copy", (event: ClipboardEvent) => {

    //   if (targetIsInput(event)) return;

    //   const content = this.app.workspace.selection.map((entity) => (
    //     entity.source.toString()
    //   )).join("");

    //   event.clipboardData.setData(this.app.workspace.file.type, content);
    //   event.preventDefault();
    // });

    // document.addEventListener("paste", (event: any) => {
    //   Array.prototype.forEach.call(event.clipboardData.items, this._paste);
    // });
  }

  _paste = async (item: DataTransferItem) => {

    try {
      await this.bus.execute(new PasteAction(item));
    } catch (e) {
      this.logger.warn("cannot paste x-entity data: ", item.type);
    }
  }
}

export const clipboardServiceDependency = new ApplicationServiceDependency("clipboard", ClipboardService);