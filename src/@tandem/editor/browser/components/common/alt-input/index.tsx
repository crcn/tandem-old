import * as React from "react";
import * as cx from "classnames";
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { ISyntheticObject } from "@tandem/sandbox";
import { BaseApplicationComponent } from "@tandem/common";

export interface IAltInputComponentProps {
  getAltProps(props): any;
  canRenderAlt?(): boolean;
  className?: string;
}
export class AltInputComponent extends BaseApplicationComponent<IAltInputComponentProps, { showAlt: boolean }> {
  state = { showAlt: false };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 91 || event.keyCode === 17) {
      this.setState({ showAlt: true });
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
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

  onMouseLeave = (event: React.MouseEvent<any>) => {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    this.setState({ showAlt: false });
  }

  render() {
    const props = this.state.showAlt ? Object.assign({}, this.props, this.props.getAltProps(this.props)) : this.props;

    return <span {...props} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
    </span>
  }
}

