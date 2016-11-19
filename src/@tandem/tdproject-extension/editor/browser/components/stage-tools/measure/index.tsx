import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { BaseApplicationComponent } from "@tandem/common";

export class MeasruementStageToolComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {
  componentDidMount() {

  }
  render() {
    return <div className="td-measurement-stage-tool">
      STAGE THIS!
    </div>
  }
}