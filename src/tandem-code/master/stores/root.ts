import { bindable, bubble, Observable } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";

export interface IUserSettings {
  textEditor: {
    bin: string,
    args?: any[]
  }
}

export class TandemStudioMasterStore extends Observable {
  @bindable(true)
  public userSettings: IUserSettings;

  @bindable(true)
  public tunnelUrl: string;
}