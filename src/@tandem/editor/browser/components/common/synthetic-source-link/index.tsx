import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { ISyntheticObject } from "@tandem/sandbox";
import { OpenSourceFileAction } from "@tandem/editor/browser/actions";
import { BaseApplicationComponent } from "@tandem/common";

// TODO: add preview of source file here
export class SyntheticSourceLink extends BaseApplicationComponent<{ target: ISyntheticObject }, { showSourceInfo: boolean }> {
  state = { showSourceInfo: false };
  onMouseEnter = (event: React.MouseEvent<any>) => {

    if (!this.props.target.source) return;

    if (event.metaKey || event.ctrlKey) {
      this.setState({ showSourceInfo: true });
    }
  }

  onMouseLeave = (event: React.MouseEvent<any>) => {
    this.setState({ showSourceInfo: false });
  }

  openSourceFile = (event: React.MouseEvent<any>) => {
    if (event.metaKey && this.props.target.source) {
      event.stopPropagation();
      this.logger.info(`Opening source file ${this.props.target.source.filePath}`);
      OpenSourceFileAction.execute(this.props.target.source, this.bus);
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

