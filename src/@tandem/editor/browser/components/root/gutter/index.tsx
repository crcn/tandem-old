import "./index.scss";
import * as React from "react";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { ENTITY_PANE_COMPONENT_NS, StoreProvider } from "@tandem/editor/browser/providers";
import { RegisteredComponent, SideDraggerComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent, inject, Metadata } from "@tandem/common";
import { MetadataValueReference, DefaultValueReference, MinMaxValueReference } from "@tandem/common/reference";

export class GutterComponent extends BaseApplicationComponent<{ className?: string,  style?: any }, any> {
  render() {
    return <div className={["td-gutter", this.props.className].join(" ")} style={this.props.style}>
      { this.props.children }
    </div>;
  }
}

