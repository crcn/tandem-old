import * as React from "react";
import { BoundingRect } from "sf-core/geom";
import { Workspace, Editor, DisplayEntitySelection } from "sf-front-end/models";
import { SelectionSizeComponent } from "sf-front-end/components/selection-size";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

class InsertToolComponent extends React.Component<{ editor: Editor }, any> {

  render() {
    const selection = (this.props.editor.workspace.selection as DisplayEntitySelection);
    const zoom = this.props.editor.transform.scale;
    const display = selection.display;
    if (!display || !display.capabilities.resizable) return null;
    const bounds = display.bounds;
    return <SelectionSizeComponent left={bounds.left + bounds.width} top={bounds.top + bounds.height} bounds={bounds} zoom={zoom} />;
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/insert/size", InsertToolComponent);
