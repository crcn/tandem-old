import "./index.scss";
import * as React from "react";
import { PaneComponent } from "../../../../../pane";
import { CSSInputComponent } from "../../../../../inputs/css-property";

/*

COMPONENT GOAL:

Display only immediate components that help user create HiFi design.

*/

const BasePrettyStylesComponent = () => <div className="m-pretty-styles">
  <div className="selectors">

  </div>
  <PaneComponent header="Layout" secondary>
    <div className="row">
      <div className="field vertical">
        <label>left</label><CSSInputComponent value="100" />
      </div>
      <div className="field vertical">
        <label>top</label><CSSInputComponent value="100" />
      </div>
    </div>
    <div className="row">
      <div className="field vertical">
        <label>width</label><CSSInputComponent value="100" />
      </div>
      <div className="field vertical">
        <label>height</label><CSSInputComponent value="100" />
      </div>
    </div>
  </PaneComponent>
  <PaneComponent header="Backgrounds" secondary>
    color, images
  </PaneComponent>
  <PaneComponent header="Typography" secondary>
    family, weight,
  </PaneComponent>
  <PaneComponent header="Shadows" secondary>
  </PaneComponent>
  <PaneComponent header="Filters" secondary>
  </PaneComponent>
</div>;

export const PrettyStylesComponent = BasePrettyStylesComponent;