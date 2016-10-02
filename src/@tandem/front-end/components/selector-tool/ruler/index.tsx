import "./index.scss";

import * as React from "react";
import LineComponent from "../line";
import calculateDistances from "./calculate-distances";
import { IEntity, IVisibleEntity } from "@tandem/common/lang/entities";
import { VisibleEntityCollection } from "@tandem/front-end/collections";

/**
 * shows distances between the entity and other objects
 */

class RulerToolComponent extends React.Component<{ selection: Array<IEntity>, allEntities: Array<IEntity> }, any> {

  render() {
    const entities = new VisibleEntityCollection(...this.props.selection);
    const selectionDisplay = entities.display;

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
