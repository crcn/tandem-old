import { bindable, Observable } from "@tandem/common";

export interface ITextEditorFile {
  uri: string;
  type: string;
  content: string|Buffer;
}

export class TextEditorStore extends Observable {

  @bindable(true)
  public show;

  public currentMtime: number;

  @bindable(true)
  currentFile: ITextEditorFile = { 
    uri: undefined, 
    type: undefined, 
    content: "" 
  };
}