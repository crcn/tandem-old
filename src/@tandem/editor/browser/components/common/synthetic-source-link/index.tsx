import "./index.scss";
import React =  require("react");
import cx =  require("classnames");
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { ISyntheticObject } from "@tandem/sandbox";
import { AltInputComponent } from "../alt-input";
import { BaseApplicationComponent } from "@tandem/common";

// TODO: add preview of source file here
// TODO: highlight other objects that share the same source
export class SyntheticSourceLink extends BaseApplicationComponent<{ target?: ISyntheticObject, getTarget?: () => ISyntheticObject }, any> {

  getTarget() {
    return this.props.target || (this.props.getTarget && this.props.getTarget()); 
  }

  hasSource() {
    return !!(this.getTarget() && !!this.getTarget().source && this.getTarget().source.filePath);
  }

  openSourceFile = (event: React.MouseEvent<any>) => {
    if (!this.hasSource()) return;
    event.stopPropagation();
    this.logger.info(`Opening source file ${this.getTarget().source.filePath}:${this.getTarget().source.start.line}:${this.getTarget().source.start.column}`);
    OpenFileRequest.dispatch(this.getTarget().source.filePath, this.getTarget().source, this.bus);
  }

  render() {

    const getAltProps = () => {
      return {
        className: cx({ "active": true, "synthetic-source-link": true, "no-source": !this.hasSource() }),
        onMouseDown: this.openSourceFile
      };
    }

    return <AltInputComponent className="synthetic-source-link" getAltProps={getAltProps}>
      { this.props.children }
    </AltInputComponent>
  }
}

