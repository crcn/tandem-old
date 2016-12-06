import React =  require("React");
import { TextEditorToken, AltInputComponent } from "@tandem/editor/browser";

export class ReferenceTokenInput extends React.Component<{ token: TextEditorToken }, any> {
  render() {

    const value = this.props.token.value;

    const getAlt = () => ({
      style: {
        cursor: "pointer"
      }
    });


    return <AltInputComponent getAltProps={getAlt}>
      { this.props.token.value }
    </AltInputComponent>
  }
}