import "./index.scss";

import * as React from "react";
// import LineComponent from "../line";
// import calculateDistances from "./calculate-distances";

/**
 * shows distances between the entity and other objects
 */

class RulerToolComponent extends React.Component<any, any> {
  // render() {
  //
  //   if (true) return null;
  //
  //   const rootEntity = this.props.entity;
  //   const rect       = this.props.app.selection.preview.getBoundingRect(true);
  //
  //   // first flatten & filter for all component entities
  //   const allBounds = rootEntity.filter(function (entity) {
  //     return /component/.test(entity.type) && !!entity.preview && entity !== rootEntity;
  //   }).map(function (entity) {
  //     return entity.preview.getBoundingRect(true);
  //   });
  //
  //   return (<div className="m-ruler-tool">
  //     {
  //       calculateDistances(
  //         allBounds, rect
  //       ).map((bounds, i) => <LineComponent {...this.props} bounds={bounds} key={i} />)
  //     }
  //   </div>);
  // }

  render() {
    return null;
  }

}

export default RulerToolComponent;
