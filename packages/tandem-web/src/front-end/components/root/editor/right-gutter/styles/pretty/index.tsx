import "./index.scss";
import * as React from "react";
import { PaneComponent } from "front-end/components/pane";
import { CSSInputComponent } from "front-end/components/inputs/css-property";

/* 

COMPONENT GOAL:

Display only immediate components that help user create HiFi design. 

*/

const BasePrettyStylesComponent = () => <div className="m-pretty-styles">
  <div className="selectors">
  
  </div>
  <PaneComponent header="Layout" secondary>
    x <CSSInputComponent value="100" />
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