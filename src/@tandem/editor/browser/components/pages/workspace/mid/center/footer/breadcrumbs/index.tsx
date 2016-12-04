import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { SyntheticDOMElement, SyntheticDOMContainer } from "@tandem/synthetic-browser";


export class BreadcrumbsComponent extends React.Component<{ workspace: Workspace }, any> {

  select = (node) => {
    this.props.workspace.select(node);
  }

  onMouseEnter = (node: SyntheticDOMContainer) => {
    node.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseLeave = (node) => {
    node.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    const { selection } = this.props.workspace;
    if (selection.length !== 1) return null;
    const element = selection[0] as SyntheticDOMElement;
    if (!element.parentNode) return null;
    return <div className="element-breadcrumbs">
      <ul>
      { 
        [element, ...element.ancestors].reverse().filter(node => node.nodeName.charAt(0) !== "#").map((node, i, nodes) => {

          let label = node.nodeName;

          if (node instanceof SyntheticDOMElement) {
            if (node.getAttribute("id")) {
              label += "#" + node.getAttribute("id");
            } 
            if (node.getAttribute("class")) {
              label += "." + node.getAttribute("class");
            }
          }

          return <li 
            className={cx({
              hovering: node.metadata.get(MetadataKeys.HOVERING),
              selected: element === node
            })} style={{  }} key={node.uid} onClick={this.select.bind(this, node)} onMouseEnter={this.onMouseEnter.bind(this, node)} onMouseLeave={this.onMouseLeave.bind(this, node)}>
              <SyntheticSourceLink target={node}>
                { label }
              </SyntheticSourceLink>
            </li>;
        })
      }
      </ul>
    </div>;
  }
}