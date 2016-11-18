import "./index.scss";
import * as React from "react";
import * as tinyColor from "tinycolor2";
import { ChromePicker } from "react-color";
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

    const getAlt = () => ({
      style: Object.assign(style, {
        cursor: "pointer"
      }),
      children: <PopdownComponent renderPopdown={this.renderColorPicker}> { value } </PopdownComponent>
    });

    return <AltInputComponent sticky={true} style={style} getAltProps={getAlt}>
      { value }
    </AltInputComponent>
  }

  renderColorPicker = () => {
    return <ChromePicker color={this.props.token.value} onChange={this.onChange} />
  }
}

export class PopdownComponent extends React.Component<{ renderPopdown(): any }, { showPopdown: boolean }> {
  state = {
    showPopdown: false
  };

  showPopdown = () => {
    this.setState({ showPopdown: true });
  }

  onMouseDown = (event: React.MouseEvent<any>) => {
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    return <span onClick={this.showPopdown}>
      { this.props.children }
      { this.state.showPopdown ? <span className="popdown" onClick={this.onMouseDown}><span className="popdown-inner">{this.props.renderPopdown()}</span></span> : null }
    </span>
  }
}