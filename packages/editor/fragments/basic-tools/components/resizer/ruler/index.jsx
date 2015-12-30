import './index.scss';

import React from 'react';
import calculateDistances from './calculate-distances';

/**
 * shows distances between the entity and other objects
 */

// TODO - ability to see ALL measurements between elements

const STEM_WIDTH = 3;

class LineComponent extends React.Component {
  render() {

    var bounds = this.props.bounds;

    var sections = {};

    if (bounds.direction === 'ew') {

      var y = bounds.height / 2;

      sections.text = <text x={bounds.width / 2} y={y + 20}>
        { bounds.width }
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
      var x = bounds.width / 2;

      sections.text = <text x={x + 10} y={bounds.height / 2 + 8}>
        { bounds.height }
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

    return <svg className='m-ruler-tool--line' style={{position:'absolute', left: bounds.left, top: bounds.top }} width={w} height={h} viewBox={[1, 1, w+2, h+2]}>
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
        ).map((bounds) => {
          return <LineComponent {...this.props} bounds={bounds} key={JSON.stringify(bounds)} />;
        })
      }
    </div>
  }
}

export default RulerToolComponent
