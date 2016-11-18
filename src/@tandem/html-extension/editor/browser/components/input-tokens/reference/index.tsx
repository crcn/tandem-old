import * as React from "react";
import { TextEditorToken } from "@tandem/editor/browser";

export class ReferenceTokenInput extends React.Component<{ token: TextEditorToken }, any> {
  render() {
    return <span className="a">
      { this.props.token.value }
    </span>
  }
}