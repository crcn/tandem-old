import "./index.scss";

import React =  require("react");
import LineComponent from "../line";
import calculateDistances from "./calculate-distances";
import { VisibleSyntheticElementCollection } from "@tandem/editor/browser/collections";

/**
 * shows distances between the entity and other objects
 */

class RulerToolComponent extends React.Component<{ selection: Array<any> }, any> {

  render() {
    const entities = new VisibleSyntheticElementCollection(...this.props.selection);
    return null;
    // const selectionDisplay = entities.display;

    // const allBounds = this.props.allEntities.map((entity) => {
    //   if (entity["display"]) return (entity as IVisibleEntity).display.bounds;
    // }).filter((bounds) => !!bounds);

    // return (<div className="m-ruler-tool">
    //   {
    //     calculateDistances(allBounds, selectionDisplay.bounds).map((bounds, i) => (
    //       <LineComponent {...this.props} bounds={bounds} key={i} />
    //     ))
    //   }
    // </div>);
  }
}

export default RulerToolComponent;
