import * as React from "react";
import { PaneComponent } from "@tandem/editor/components/common";
import { FrontEndApplication } from "@tandem/editor";
import { SyntheticDOMAttribute } from "@tandem/synthetic-browser";

import { DOMElementEntityCollection } from "@tandem/html-extension/collections";

class AttributeComponent extends React.Component<{ attribute: SyntheticDOMAttribute, setAttribute: (key: string, value: string) => any}, any> {
  render() {
    const { attribute } = this.props;
    return <div>
      <div className="col-xs-2">
        {attribute.name}:
      </div>
      <div className="col-xs-10">
        {attribute.value}
      </div>
    </div>;
  }
}

export class EntityAttributesPaneComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {

    const { editor } = this.props.app;
    if (!editor || !editor.selection.length) return null;
    const items = new DOMElementEntityCollection(...editor.selection);
    if (!items.length) return null;

    return <PaneComponent title="Attributes">
      <div className="row">
        {
          items.attributes.map((attribute) => {
            return <AttributeComponent key={attribute.name} attribute={attribute} setAttribute={items.setAttribute.bind(items)} />;
          })
        }
      </div>
    </PaneComponent>
  }
}