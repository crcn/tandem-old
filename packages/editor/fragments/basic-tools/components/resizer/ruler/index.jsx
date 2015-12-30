import './index.scss';

import React from 'react';
import calculateDistances from './calculate-distances';

/**
 * shows distances between the entity and other objects
 */

// TODO - ability to see ALL measurements between elements

const STEM_WIDTH = 4;

function scaleBounds(bounds, zoom) {
  return {
    left      : Math.round(bounds.left   * zoom),
    top       : Math.round(bounds.top    * zoom),
    width     : Math.round(bounds.width  * zoom),
    height    : Math.round(bounds.height * zoom),
    direction : bounds.direction
  }
}

class LineComponent extends React.Component {
  render() {

    var bounds = scaleBounds(this.props.bounds, this.props.zoom);

    var sections = {};

    if (bounds.direction === 'ew') {

      var y = Math.round(bounds.height / 2);

      sections.text = <text x={Math.round(bounds.width / 2)} y={y + 20}>
        { this.props.bounds.width  }
      </text>;

      var d = [
        'M' + 0 + ' ' + (y - STEM_WIDTH),
        'L' + 0 + ' ' + (y + STEM_WIDTH),
        'M' + 0 + ' ' + y,
        'L' + bounds.width + ' ' + y,
        'M' + bounds.width + ' ' + (y - STEM_WIDTH),
        'L' + bounds.width + ' ' + (y + STEM_WIDTH),
      ].join('');
    } else {
      var x = Math.round(bounds.width / 2);

      sections.text = <text x={x + 10} y={Math.round(bounds.height / 2 + 8)}>
        { this.props.bounds.height }
      </text>;

      var d = [
        'M' + (x - STEM_WIDTH) + ' ' + 0,
        'L' + (x + STEM_WIDTH) + ' ' + 0,
        'M' + x + ' ' + 0,
        'L' + x + ' ' + bounds.height,
        'M' + (x - STEM_WIDTH) + ' ' + bounds.height,
        'L' + (x + STEM_WIDTH) + ' ' + bounds.height,
      ].join('');
    }

    var w = Math.max(bounds.width, 60);
    var h = Math.max(bounds.height, 60);

    return <svg className='m-ruler-tool--line' style={{position:'absolute', left: bounds.left, top: bounds.top }} width={w} height={h} viewBox={[-STEM_WIDTH, -STEM_WIDTH, w+STEM_WIDTH, h+STEM_WIDTH]}>
      <path d={d} strokeWidth={1} fill='transparent' />
      { sections.text }
    </svg>
  }
}

class RulerToolComponent extends React.Component {
  render() {

    var root = this.props.app.rootEntity;

    return <div className='m-ruler-tool'>
      {
        calculateDistances(
          root, this.props.app.focus.getComputedStyle()
        ).map((bounds, i) => {
          return <LineComponent {...this.props} bounds={bounds} key={i} />;
        })
      }
    </div>
  }
}

export default RulerToolComponent
