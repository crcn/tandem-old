import "./index.scss";
import * as React from "react";
import { PaneComponent } from "front-end/components/pane";

/* 

TODOS: 

*/

const BasePrettyStylesComponent = () => <div className="m-pretty-styles">
  <div className="selectors">
    INHERITED SELECTOS
  </div>
  <PaneComponent header="Layout" secondary>
    x, y, width, height, padding, margin, display, position
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