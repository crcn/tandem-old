import { ObservableCollection, Observable, bindable, bubble, ActiveRecordCollection } from "@tandem/common";

import { IStarterOption, IHelpOption } from "tandem-code/common";

export class TandemStudioBrowserStore extends Observable {

  @bindable(true)
  @bubble()
  public projectStarterOptions: IStarterOption[];

  @bindable(true)
  @bubble()
  public helpOptions: IHelpOption[];
}