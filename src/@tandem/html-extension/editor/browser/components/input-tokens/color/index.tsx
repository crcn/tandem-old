import "./index.scss";
import React =  require("react");
import tinyColor =  require("tinycolor2");
import { ChromePicker } from "react-color";
import { PortalComponent, DropdownComponent } from "@tandem/uikit";
import { TextEditorToken, AltInputComponent,  } from "@tandem/editor/browser";

export class ColorTokenInput extends React.Component<{ token: TextEditorToken }, any> {

  onChange = ({ rgb, hex }) => {
    let newValue;

    if (rgb.a !== 1) {
      newValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    } else {
      newValue = hex.toUpperCase();
    }

    this.props.token.updateValue(newValue).catch((e) => {})
  }

  render() {

    const value = this.props.token.value;

    const style = {
      color: tinyColor(value).isLight() ? "black" : "white",
      background: value,
      borderRadius: 2
    };
    return <span style={style}>
      { value }
    </span>
  }
}
