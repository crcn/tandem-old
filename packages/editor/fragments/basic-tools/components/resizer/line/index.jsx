import './index.scss';
import React from 'react';

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

    var stemWidth = this.props.showStems !== false ? STEM_WIDTH : 0;

    var bounds = scaleBounds(this.props.bounds, this.props.zoom);

    var sections = {};

    if (bounds.direction === 'ew') {

      var y = Math.round(bounds.height / 2);

      // center & offset width of text
      sections.text = <text x={Math.round(bounds.width / 2) - (String(this.props.bounds.width).length * 5)/2 } y={y + 20}>
        { this.props.bounds.width  }
      </text>;

      var d = [        'M' + 0 + ' ' + (y - stemWidth),
        'L' + 0 + ' ' + (y + stemWidth),
        'M' + 0 + ' ' + y,
        'L' + bounds.width + ' ' + y,
        'M' + bounds.width + ' ' + (y - stemWidth),
        'L' + bounds.width + ' ' + (y + stemWidth),
      ];
    } else {
      var x = Math.round(bounds.width / 2);

        sections.text = <text x={x + 10} y={Math.round(bounds.height / 2 + 4)}>
        { this.props.bounds.height }
      </text>;

      var d = [
        'M' + (x - stemWidth) + ' ' + 0,
        'L' + (x + stemWidth) + ' ' + 0,
        'M' + x + ' ' + 0,
        'L' + x + ' ' + bounds.height,
        'M' + (x - stemWidth) + ' ' + bounds.height,
        'L' + (x + stemWidth) + ' ' + bounds.height,
      ];
    }


    var w = Math.max(bounds.width, 60);
    var h = Math.max(bounds.height, 60);

    return <svg className='m-guide-line' style={{position:'absolute', left: bounds.left, top: bounds.top }} width={w} height={h} viewBox={[-stemWidth, -stemWidth, w+stemWidth, h+stemWidth]}>
      <path d={d.join('')} strokeWidth={1} fill='transparent' />
      { this.props.showDistance !== false ? sections.text : void 0 }
    </svg>
  }
}

export default LineComponent;