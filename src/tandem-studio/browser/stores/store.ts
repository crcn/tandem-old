import { ObservableCollection, Observable, bindable, bubble, ActiveRecordCollection } from "@tandem/common";

import { IStarterOption } from "tandem-studio/common";

export class TandemStudioBrowserStore extends Observable {

  @bindable(true)
  @bubble()
  public projectStarterOptions: IStarterOption[];

}