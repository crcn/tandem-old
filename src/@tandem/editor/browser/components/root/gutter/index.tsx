import "./index.scss";
import * as React from "react";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { ENTITY_PANE_COMPONENT_NS, StoreProvider } from "@tandem/editor/browser/providers";
import { RegisteredComponent, SideDraggerComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent, inject, Metadata } from "@tandem/common";
import { MetadataValueReference, DefaultValueReference, MinMaxValueReference } from "@tandem/common/reference";

export class GutterComponent extends BaseApplicationComponent<{ workspace: Workspace, settings: Metadata, position: string, maxWidth?: number, registeredComponentNs?: string, hideKey?: string, sizeKey?: string }, any> {

  render() {

    const sidebarSizeReference = new MinMaxValueReference(
      new DefaultValueReference(new MetadataValueReference(this.props.settings, this.props.sizeKey), 200),
      50,
      this.props.maxWidth
    );

    const style = {
      width: sidebarSizeReference.value
    };

    return this.props.settings.get(this.props.hideKey) === true || !this.props.workspace ? null : <div className={["td-gutter", this.props.position].join(" ")} style={style}>
      { this.props.children ? this.props.children : <RegisteredComponent {...this.props} ns={this.props.registeredComponentNs} /> }
      <SideDraggerComponent position={this.props.position === "right" ? "left" : "right"} reference={sidebarSizeReference} />
    </div>;
  }
}

