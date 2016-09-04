import "./index.scss";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import RegisteredComponent from "tandem-front-end/components/registered";
import { FrontEndApplication } from "tandem-front-end/application";
import { SideDraggerComponent } from "tandem-front-end/components/side-dragger";
import { ENTITY_PANE_COMPONENT_NS } from "tandem-front-end/dependencies";
import { MetadataValueReference, DefaultValueReference, MinMaxValueReference } from "tandem-common/reference";

export class SidebarComponent extends React.Component<{ app: FrontEndApplication, position: string, maxWidth?: number, registeredComponentNs: string, hideKey: string, sizeKey: string }, any> {
  render() {

    const sidebarSizeReference = new MinMaxValueReference(
      new DefaultValueReference(new MetadataValueReference(this.props.app.settings, this.props.sizeKey), 200),
      50,
      this.props.maxWidth
    );

    const style = {
      width: sidebarSizeReference.value
    };

    return this.props.app.settings.get(this.props.hideKey) === true ? null : <div className={["m-sidebar", this.props.position].join(" ")} style={style}>
      <RegisteredComponent {...this.props} ns={this.props.registeredComponentNs} />
      <SideDraggerComponent position={this.props.position === "right" ? "left" : "right"} reference={sidebarSizeReference} />
    </div>;
  }
}

