import React =  require("React");
import { IInjectable } from "@tandem/common";

export const editorComponentContextTypes = {
  bus: React.PropTypes.object.isRequired,
  injector: React.PropTypes.object.isRequired
};

export class BaseEditorComponent<T, U> extends React.Component<T, U> {
  static contextTypes = editorComponentContextTypes;
  constructor(args: any[]) {
    super(...args);
  }
}