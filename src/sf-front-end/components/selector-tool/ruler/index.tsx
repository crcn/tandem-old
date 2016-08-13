import "./index.scss";

import * as React from "react";
import LineComponent from "../line";
import calculateDistances from "./calculate-distances";
import { DisplayEntitySelection } from "sf-front-end/models";
import { IEntity, IVisibleEntity } from "sf-core/entities";

/**
 * shows distances between the entity and other objects
 */

class RulerToolComponent extends React.Component<{ selection: DisplayEntitySelection, allEntities: Array<IEntity> }, any> {

  render() {
    const selectionDisplay = this.props.selection.display;

    const allBounds = this.props.allEntities.map((entity) => {
      if (entity["display"]) return (entity as IVisibleEntity).display.bounds;
    }).filter((bounds) => !!bounds);

    return (<div className="m-ruler-tool">
      {
        calculateDistances(allBounds, selectionDisplay.bounds).map((bounds, i) => (
          <LineComponent {...this.props} bounds={bounds} key={i} />
        ))
      }
    </div>);
  }
}

export default RulerToolComponent;
