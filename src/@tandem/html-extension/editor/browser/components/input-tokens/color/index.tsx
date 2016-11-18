import * as React from "react";
import { TextEditorToken } from "@tandem/editor/browser";

export class ColorTokenInput extends React.Component<{ token: TextEditorToken }, any> {
  render() {
    return <span>
      { this.props.token.value }
    </span>
  }
}