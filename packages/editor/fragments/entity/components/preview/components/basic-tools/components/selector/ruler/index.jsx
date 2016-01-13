import './index.scss';

import React from 'react';
import LineComponent from '../line';
import calculateDistances from './calculate-distances';

/**
 * shows distances between the entity and other objects
 */

class RulerToolComponent extends React.Component {
  render() {

    return null;

    var rootEntity = this.props.app.rootEntity;
    var rect       = this.props.app.selection.preview.getBoundingRect(true);

    // first flatten & filter for all component entities
    var allBounds = rootEntity.filter(function(entity) {
      return /component/.test(entity.type) && !!entity.preview && entity !== rootEntity;
    }).map(function(entity) {
      return entity.preview.getBoundingRect(true);
    });

    return <div className='m-ruler-tool'>
      {
        calculateDistances(
          allBounds, rect
        ).map((bounds, i) => {
          return <LineComponent {...this.props} bounds={bounds} key={i} />;
        })
      }
    </div>
  }
}

export default RulerToolComponent
