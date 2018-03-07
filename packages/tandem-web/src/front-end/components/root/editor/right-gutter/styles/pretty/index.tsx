import "./index.scss";
import * as React from "react";
import { PaneComponent } from "front-end/components/pane";

/* 

COMPONENT GOAL:

Display only immediate components that help user create HiFi design. 

*/

const BasePrettyStylesComponent = () => <div className="m-pretty-styles">
  <div className="selectors">
    INHERITED SELECTOS
  </div>
  <PaneComponent header="Layout" secondary>
    x, y, width, height
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