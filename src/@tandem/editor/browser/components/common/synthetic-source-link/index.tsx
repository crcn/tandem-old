import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { ISyntheticObject } from "@tandem/sandbox";
import { OpenFileAction } from "@tandem/editor/browser/actions";
import { BaseApplicationComponent } from "@tandem/common";

// TODO: add preview of source file here
export class SyntheticSourceLink extends BaseApplicationComponent<{ target: ISyntheticObject }, { showSourceInfo: boolean }> {
  state = { showSourceInfo: false };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 91 || event.keyCode === 17) {
      this.setState({ showSourceInfo: true });
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 91 || event.keyCode === 17) {
      this.setState({ showSourceInfo: false });
    }
  }

  hasSource() {
    return this.props.target.source && this.props.target.source.filePath;
  }

  onMouseEnter = (event: React.MouseEvent<any>) => {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);

    if (!this.hasSource()) return;

    if (event.metaKey || event.ctrlKey) {
      this.setState({ showSourceInfo: true });
    }
  }

  onMouseLeave = (event: React.MouseEvent<any>) => {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    this.setState({ showSourceInfo: false });
  }

  openSourceFile = (event: React.MouseEvent<any>) => {
    if (event.metaKey && this.hasSource()) {
      event.stopPropagation();
      this.logger.info(`Opening source file ${this.props.target.source.filePath}:${this.props.target.source.start.line}:${this.props.target.source.start.column}`);
      OpenFileAction.execute(this.props.target.source.filePath, this.props.target.source, this.bus);
    }
  }

  render() {

    const classNames = cx({
      "active": this.state.showSourceInfo,
      "synthetic-source-link": true,
    });

    return <span className={classNames} onClick={this.openSourceFile.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
      { this.props.children }
    </span>
  }
}

