import './index.scss';
import React from 'react';

const STEM_WIDTH = 4;

class LineComponent extends React.Component {
  render() {

    var stemWidth = this.props.showStems !== false ? STEM_WIDTH : 0;

    var bounds = this.props.bounds;

    var sections = {};

    if (bounds.direction === 'ew') {

      var y = Math.round(bounds.height / 2);

      // center & offset width of text
      sections.text = <text x={Math.round(bounds.width / 2) - (String(this.props.bounds.width).length * 5)/2 } y={y + 20}>
        { this.props.bounds.width  }
      </text>;

      var d = [        'M' + 3 + ' ' + (y - stemWidth),
        'L' + 3 + ' ' + (y + stemWidth),
        'M' + 3 + ' ' + y,
        'L' + (bounds.width - 1) + ' ' + y,
        'M' + (bounds.width - 1) + ' ' + (y - stemWidth),
        'L' + (bounds.width - 1) + ' ' + (y + stemWidth),
      ];
    } else {
      var x = Math.round(bounds.width / 2);

        sections.text = <text x={x + 10} y={Math.round(bounds.height / 2 + 4)}>
        { this.props.bounds.height }
      </text>;

      var d = [
        'M' + (x - stemWidth) + ' ' + 3,
        'L' + (x + stemWidth) + ' ' + 3,
        'M' + x + ' ' + 3,
        'L' + x + ' ' + (bounds.height - 1),
        'M' + (x - stemWidth) + ' ' + (bounds.height - 1),
        'L' + (x + stemWidth) + ' ' + (bounds.height - 1),
      ];
    }

    var w = Math.max(bounds.width, 60) + stemWidth * 2;
    var h = Math.max(bounds.height, 60) + stemWidth * 2;

    return <svg className='m-guide-line' style={{position:'absolute', left: bounds.left, top: bounds.top }} width={w} height={h} viewBox={[0, 0, w, h]}>
      <path d={d.join('')} strokeWidth={1} fill='transparent' />
      { this.props.showDistance !== false ? sections.text : void 0 }
    </svg>
  }
}

export default LineComponent;
