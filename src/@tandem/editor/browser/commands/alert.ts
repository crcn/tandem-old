import { ICommand } from "@tandem/common";
import { AlertMessage } from "@tandem/editor/browser/actions";

export class AlertCommand implements ICommand {
  execute({ type, text }: AlertMessage) {

    // for now - need a UI around this.
    alert(text);
  }
}