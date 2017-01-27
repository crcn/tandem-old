import { Observable, bindable, bubble, LogEvent, ObservableCollection } from "@tandem/common";
import { MergedCSSStyleRule } from "./merged-style-rule";


export class HTMLExtensionStore extends Observable {
  
  @bindable(true)
  @bubble()
  public mergedStyleRule: MergedCSSStyleRule;


  @bindable(true)
  @bubble()
  public vmLogs: ObservableCollection<LogEvent> = ObservableCollection.create<LogEvent>() as any;


  clearVMLogs() {
    this.vmLogs = ObservableCollection.create<LogEvent>() as any;
  }
}