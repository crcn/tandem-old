import { FrontEndApplication } from "sf-front-end/application";

import { Logger } from "sf-core/logger";
import { loggable } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { PasteAction } from "sf-front-end/actions";
import { serialize } from "sf-core/serialize";

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable()
export default class ClipboardService extends BaseApplicationService<FrontEndApplication> {

  public logger: Logger;

  initialize() {
    document.addEventListener("copy", (event: any) => {
      if (targetIsInput(event)) return;

      const content = serialize(this.app.editor.selection.map((entity) => (
        entity.expression
      )));

      console.log(content);

      event.clipboardData.setData("text/x-entity", content);
      console.log(content);
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