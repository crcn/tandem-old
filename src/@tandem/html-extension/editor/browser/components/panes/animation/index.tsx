import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";
import { Workspace } from "@tandem/editor/browser/stores";
import { SyntheticDOMElement, getCSSFontFaceRules } from "@tandem/synthetic-browser";



class StyleRuleAnimationsComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

}

export class CSSAnimationComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {
  render() {
    const { selection } = this.props.workspace;
    if (!selection.length) return null;

    return <div className="css-animation-pane">
      <div className="header">
        CSS Animations
        <div className="rail">
          <div className="scrub" />
        </div>
        <div className="controls">
          <i className="ion-play" />
        </div>
      </div>
      <div className="row selector">
        <div className="label">
          .container
        </div>
      </div>
      <div className="row animation">
        <div className="label">
          fade-in
        </div>
        <div className="keyframes">
          <div className="keyframe" style={{left: 200 }} />
          <div className="keyframe" style={{left: 300 }} />
        </div>
      </div>
      <div className="row selector">
        <div className="label">
          container2
        </div>
      </div>
    </div>;
  }
}