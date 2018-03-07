import "./index.scss";
import * as React from "react";
import { PaneComponent } from "front-end/components/pane";
import { RawAttributesComponent } from "./raw";
import { PrettyAttributesComponent } from "./pretty";

const BaseAttributesPaneComponent = () => <PaneComponent header="Attributes" className="m-attributes">
  <RawAttributesComponent />
</PaneComponent>;

export const AttributesPaneComponent = BaseAttributesPaneComponent;
