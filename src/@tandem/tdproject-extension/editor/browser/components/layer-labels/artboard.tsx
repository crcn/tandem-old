import "./artboard.scss";
import * as React from "react";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";

export class ArtboardLayerLabelComponent extends React.Component<{ element: SyntheticTDArtboardElement, renderOuterLabel: (inner, className) => any }, any> {
  render() {
    const { element, renderOuterLabel } = this.props;
    return renderOuterLabel(element.title, "td-artboard-layer-label");
  }
}