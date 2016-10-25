import "./index.scss";
import * as React from "react";
import { RegisteredComponent, SideDraggerComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent, inject, Metadata } from "@tandem/common";
import { ENTITY_PANE_COMPONENT_NS, SettingsDependency } from "@tandem/editor/browser/dependencies";
import { MetadataValueReference, DefaultValueReference, MinMaxValueReference } from "@tandem/common/reference";


export class GutterComponent extends BaseApplicationComponent<{ position: string, maxWidth?: number, registeredComponentNs: string, hideKey: string, sizeKey: string }, any> {

  @inject(SettingsDependency.ID)
  private _settings: Metadata;

  render() {

    const sidebarSizeReference = new MinMaxValueReference(
      new DefaultValueReference(new MetadataValueReference(this._settings, this.props.sizeKey), 200),
      50,
      this.props.maxWidth
    );

    const style = {
      width: sidebarSizeReference.value
    };

    return this._settings.get(this.props.hideKey) === true ? null : <div className={["m-sidebar gutter", this.props.position].join(" ")} style={style}>
      <RegisteredComponent {...this.props} ns={this.props.registeredComponentNs} />
      <SideDraggerComponent position={this.props.position === "right" ? "left" : "right"} reference={sidebarSizeReference} />
    </div>;
  }
}

