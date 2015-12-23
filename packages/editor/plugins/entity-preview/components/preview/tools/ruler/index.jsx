import React from 'react';

/**
 * shows distances between the entity and other objects
 */

// TODO - ability to see ALL measurements between elements

function calculateDistances(rootEntity) {
  var visualElements = rootEntity.flatten().filter(function(entity) {
    return entity.type === 'component';
  });

  // console.log(visualElements);
}

class DistanceComponent extends React.Component {
  render() {

    var w = 100;
    var h = 20;
    return <svg width={w} height={h} viewBox={[0, 0, w, h]}>
      <path d='M0 0L10 0' strokeWidth={1} stroke='black' fill='transparent' />

    </svg>
  }
}

class RulerToolComponent extends React.Component {
  render() {

    var root = this.props.app.rootEntity;

    calculateDistances(root);

    return <div className='m-ruler-tool'>
      <DistanceComponent />
    </div>
  }
}

export default RulerToolComponent
