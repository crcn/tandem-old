import { Logger } from "sf-core/logger";
import { loggable } from "sf-core/decorators";
import { serialize } from "sf-core/serialize";
import { PasteAction } from "sf-front-end/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable()
export default class ClipboardService extends BaseApplicationService<FrontEndApplication> {

  public logger: Logger;

  initialize() {
    document.addEventListener("copy", (event: ClipboardEvent) => {

      if (targetIsInput(event)) return;

      const content = this.app.workspace.selection.map((entity) => (
        entity.source.toString()
      )).join("");

      event.clipboardData.setData(this.app.workspace.file.type, content);
      event.preventDefault();
    });

    document.addEventListener("paste", (event: any) => {
      Array.prototype.forEach.call(event.clipboardData.items, this._paste);
    });
  }

  _paste = async (item: DataTransferItem) => {

    try {
      await this.bus.execute(new PasteAction(item));
    } catch (e) {
      this.logger.warn("cannot paste x-entity data: ", item.type);
    }
  }
}

export const dependency = new ApplicationServiceDependency("clipboard", ClipboardService);