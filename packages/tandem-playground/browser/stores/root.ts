import { TextEditorStore } from "./text-editor";
import { Observable, bindable, bubble } from "@tandem/common";

export class RootPlaygroundBrowserStore extends Observable {

  @bindable(true)
  @bubble()
  readonly textEditor = new TextEditorStore();
}