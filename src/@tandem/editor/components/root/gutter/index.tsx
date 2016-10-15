import "./index.scss";
import * as React from "react";
import { RegisteredComponent, SideDraggerComponent } from "@tandem/editor/components/common";
import { FrontEndApplication } from "@tandem/editor/application";
import { ENTITY_PANE_COMPONENT_NS } from "@tandem/editor/dependencies";
import { MetadataValueReference, DefaultValueReference, MinMaxValueReference } from "@tandem/common/reference";

export class GutterComponent extends React.Component<{ app: FrontEndApplication, position: string, maxWidth?: number, registeredComponentNs: string, hideKey: string, sizeKey: string }, any> {
  render() {

    const sidebarSizeReference = new MinMaxValueReference(
      new DefaultValueReference(new MetadataValueReference(this.props.app.settings, this.props.sizeKey), 200),
      50,
      this.props.maxWidth
    );

    const style = {
      width: sidebarSizeReference.value
    };

    return this.props.app.settings.get(this.props.hideKey) === true ? null : <div className={["m-sidebar gutter", this.props.position].join(" ")} style={style}>
      <RegisteredComponent {...this.props} ns={this.props.registeredComponentNs} />
      <SideDraggerComponent position={this.props.position === "right" ? "left" : "right"} reference={sidebarSizeReference} />
    </div>;
  }
}

