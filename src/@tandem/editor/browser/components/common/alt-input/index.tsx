import * as React from "react";
import * as cx from "classnames";
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { ISyntheticObject } from "@tandem/sandbox";
import { BaseApplicationComponent } from "@tandem/common";

export interface IAltInputComponentProps {
  getAltProps(props): any;
  showAlt?: boolean;
  canRenderAlt?(): boolean;
  className?: string;
  onMouseDown?(event: React.MouseEvent<any>): any;
  style?: any;
  sticky?: boolean;
}

export class AltInputComponent extends BaseApplicationComponent<IAltInputComponentProps, { showAlt: boolean }> {
  state = { showAlt: false };
  private _keepOpen: boolean;

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 91 || event.keyCode === 17) {
      this.setState({ showAlt: true });
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    if (this._keepOpen) return;
    if (event.keyCode === 91 || event.keyCode === 17) {
      this.setState({ showAlt: false });
    }
  }

  canRenderAlt() {
    return !this.props.canRenderAlt || this.props.canRenderAlt();
  }

  onMouseEnter = (event: React.MouseEvent<any>) => {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);

    if (!this.canRenderAlt()) return;

    if (event.metaKey || event.ctrlKey) {
      this.setState({ showAlt: true });
    }
  }

  onMouseLeave = (event) => {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    if (this._keepOpen) return;
    this.setState({ showAlt: false });
  }

  onClick = (event) => {
    if (!this.props.sticky || this._keepOpen) return;
    this._keepOpen = true;
    const self = this;
    document.addEventListener("click", function onClick() {
      self._keepOpen = false;
      document.removeEventListener("click", onClick);
      self.onMouseLeave(event);
    });
  }

  render() {
    const props = this.props.showAlt || this.state.showAlt ? Object.assign({}, this.props, this.props.getAltProps(this.props)) : this.props;

    return <span style={props.style} onMouseDown={props.onMouseDown} className={props.className} onClick={this.onClick} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
      { props.children }
    </span>
  }
}

