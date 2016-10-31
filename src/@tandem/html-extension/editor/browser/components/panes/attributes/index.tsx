import "reflect-metadata";

import * as React from "react";
import { Workspace } from "@tandem/editor/browser";
import { DOMElements } from "@tandem/html-extension/collections";
import { reactPreview } from "@tandem/common";
import { PaneComponent } from "@tandem/editor/browser/components/common";
import {
  SyntheticWindow,
  SyntheticLocation,
  SyntheticHTMLElement,
  SyntheticDOMAttribute,
} from "@tandem/synthetic-browser";

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

export class EntityAttributesPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { selection } = this.props.workspace;
    const items = DOMElements.fromArray(selection);
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

reactPreview(() => {
  const workspace = new Workspace();
  const window = new SyntheticWindow(null, new SyntheticLocation("test"));
  (window.document.body as SyntheticHTMLElement).innerHTML = `
    <div class="test" id="some id" />
  `;
  workspace.select(window.document.body.querySelector("div"));
  return <EntityAttributesPaneComponent workspace={workspace} />
})(EntityAttributesPaneComponent);