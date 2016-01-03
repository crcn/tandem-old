import './index.scss';

import React from 'react';
import LineComponent from '../line';
import calculateDistances from './calculate-distances';

/**
 * shows distances between the entity and other objects
 */

// TODO - ability to see ALL measurements between elements

class RulerToolComponent extends React.Component {
  render() {

    var root = this.props.app.rootEntity;

    return <div className='m-ruler-tool'>
      {
        calculateDistances(
          root, this.props.app.selection.preview.getBoundingRect()
        ).map((bounds, i) => {
          return <LineComponent {...this.props} bounds={bounds} key={i} />;
        })
      }
    </div>
  }
}

export default RulerToolComponent
