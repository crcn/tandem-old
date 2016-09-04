import { Logger } from "tandem-common/logger";
import { loggable } from "tandem-common/decorators";
import { serialize } from "tandem-common/serialize";
import { INITIALIZE } from "tandem-common/actions";
import { PasteAction } from "tandem-front-end/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { BaseApplicationService } from "tandem-common/services";
import { ApplicationServiceDependency } from "tandem-common/dependencies";

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable()
export default class ClipboardService extends BaseApplicationService<FrontEndApplication> {

  public logger: Logger;

  [INITIALIZE]() {
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