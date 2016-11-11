import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";

export class CSSAnimationComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <div className="css-animation-pane">
      <div className="td-section-header">
        CSS Animations
      </div>

      <div className="controls">
        <div className="scrub-rail" />
        <div className="needle">
        </div>

        <div className="rule arow">
          <label className="color-pink-10">.container</label>
        </div>
        <div className="animation arow">
          <label>fade-in</label>
          <div className="boundary">
            <div className="range" style={{ left: 10, width: 100 }}>

            </div>
          </div>
        </div>
        <div className="animation arow">
          <label>pop-up</label>
          <div className="boundary">
            <div className="range" style={{ left: 100, width: 100 }}>
              <div className="keyframe" style={{ left: 10 }} />
            </div>
          </div>
        </div>

        <hr />
      </div>
    </div>;
  }
}