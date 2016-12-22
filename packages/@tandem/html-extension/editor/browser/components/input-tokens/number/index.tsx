import React =  require("react");
import { TextEditorToken, NumberSliderInput, AltInputComponent } from "@tandem/editor/browser";

export class NumberTokenInput extends React.Component<{ token: TextEditorToken }, any> {

  onChange = (value) => {
    this.props.token.updateValue(value).catch(() => {})
  }

  render() {
    const renderAlt = () => ({
      children: <NumberSliderInput value={Number(this.props.token.value)} onChange={this.onChange} />
    });

    return <AltInputComponent getAltProps={renderAlt}>
      { this.props.token.value }
    </AltInputComponent>
  }
}