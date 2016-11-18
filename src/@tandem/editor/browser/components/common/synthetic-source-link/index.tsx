import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { ISyntheticObject } from "@tandem/sandbox";
import { AltInputComponent } from "../alt-input";
import { BaseApplicationComponent } from "@tandem/common";

// TODO: add preview of source file here
export class SyntheticSourceLink extends BaseApplicationComponent<{ target: ISyntheticObject }, any> {

  hasSource() {
    return !!(this.props.target.source && this.props.target.source.filePath);
  }

  openSourceFile = (event: React.MouseEvent<any>) => {
    event.stopPropagation();
    this.logger.info(`Opening source file ${this.props.target.source.filePath}:${this.props.target.source.start.line}:${this.props.target.source.start.column}`);
    OpenFileRequest.dispatch(this.props.target.source.filePath, this.props.target.source, this.bus);
  }

  render() {

    const getAltProps = () => {
      return {
        className: cx({ "active": true, "synthetic-source-link": true }),
        onClick: this.openSourceFile
      };
    }


    return <AltInputComponent canRenderAlt={() => this.hasSource()} className="synthetic-source-link" getAltProps={getAltProps}>
      { this.props.children }
    </AltInputComponent>
  }
}

