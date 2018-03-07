import "./index.scss";
import * as React from "react";
import { PaneComponent } from "front-end/components/pane";
import { PrettyStylesComponent } from "./pretty";

/*
TODO - pretty tab, and source tab
*/

const BaseStylesPaneComponent = () => <PaneComponent header="Styles" className="m-styles-pane">
  <PrettyStylesComponent />
</PaneComponent>;

export const StylesPaneComponent = BaseStylesPaneComponent;