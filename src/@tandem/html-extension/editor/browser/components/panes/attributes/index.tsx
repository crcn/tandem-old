import * as React from "react";
import { PaneComponent } from "@tandem/editor/browser/components/common";
import { FrontEndApplication } from "@tandem/editor/browser";
import { SyntheticDOMAttribute } from "@tandem/synthetic-browser";

import { DOMElements } from "@tandem/html-extension/collections";

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
    return null;

    // const { editor } = this.props.app;
    // if (!editor || !editor.selection.length) return null;
    // const items = []; //new DOMElementCollection(...editor.selection);
    // if (!items.length) return null;

    // return <PaneComponent title="Attributes">
    //   <div className="row">
    //     {
    //       items.attributes.map((attribute) => {
    //         return <AttributeComponent key={attribute.name} attribute={attribute} setAttribute={items.setAttribute.bind(items)} />;
    //       })
    //     }
    //   </div>
    // </PaneComponent>
  }
}