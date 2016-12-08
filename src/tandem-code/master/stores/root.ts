import { bindable, bubble, Observable } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";

export interface IUserSettings {
  textEditor: {
    bin: string
  }
}

export class TandemStudioMasterStore extends Observable {
  @bindable(true)
  public userSettings: IUserSettings;
}