import React =  require("React");
import { TextEditorToken } from "@tandem/editor/browser";

export class UnitTokenInput extends React.Component<{ token: TextEditorToken }, any> {
  render() {
    return <span className="a">
      { this.props.token.value }
    </span>
  }
}