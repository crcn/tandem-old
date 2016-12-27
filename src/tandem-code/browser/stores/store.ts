import { IStarterOption, IHelpOption } from "tandem-code/common";
import { 
  bubble, 
  bindable, 
  Observable, 
  ObservableCollection, 
  ActiveRecordCollection, 
} from "@tandem/common";

export class TandemStudioBrowserStore extends Observable {

  @bindable(true)
  @bubble()
  public projectStarterOptions: IStarterOption[];

  @bindable(true)
  @bubble()
  public helpOptions: IHelpOption[];
}