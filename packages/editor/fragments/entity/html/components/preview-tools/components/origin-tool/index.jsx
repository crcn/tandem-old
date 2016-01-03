import './index.scss';
import React from 'react';


class OriginEntityComponent extends React.Component {
  render() {

    var capabilities = this.props.entity.preview.getCapabilities();

    if (!capabilities.movable) return null;

    var rect  = this.props.entity.preview.getBoundingRect(true);
    var style = this.props.entity.preview.getStyle(true);

    var originLeft = rect.left - style.left;
    var originTop  = rect.top  - style.top;

    var ostyle = {
      left: originLeft,
      top : originTop,
      position: 'absolute',
      width: rect.width,
      height: rect.height,
      opacity: 0.5
    };

    var x1 = (rect.left + rect.width / 2);
    var y1 = (rect.top + rect.height / 2);
    var x2 = (ostyle.left + ostyle.width / 2);
    var y2 = (ostyle.top + ostyle.height / 2);

    var y3 = y2 - y1;
    var x3 = x2 - x1;

    var rotation =  180 - Math.atan2(x3, y3) * 180 / Math.PI;

    // length should extend to outside of element
    var length   = Math.max(0, Math.round(Math.sqrt(Math.pow(x3, 2) + Math.pow(y3, 2))) - rect.width / 2 - 10);

    var d = [

      // 6 = center of 11. Accounting for 1px thickness
      'M6 ' + 0,

      // remove last pixel so that arrow can fit
      'L6 ' + (length - 1)
    ];


    return <div>
      <div style={ostyle} className='m-origin-preview-tool--entity'>

      </div>
      <svg style={{
        left: x2,
        top : y2,
        transform: 'rotate(' + rotation + 'deg)',
        transformOrigin: 'top center'
      }} viewBox={[0, 0, 11, length]} width={11} height={length}>
        <path d={[
          'M6 ' + length,
          'L4 ' + (length - 5),
          'M6 ' + length,
          'L8 ' + (length - 5)
         ].join('')} stroke='#FF00FF' fill='transparent' />

        <path d={d.join('')} stroke='#FF00FF' fill='transparent' />
      </svg>
    </div>
  }
}

class OriginToolComponent extends React.Component {
  render() {
    if (!this.props.selection.preview.moving) return null;
    return <div className='m-origin-preview-tool'>
      {
        this.props.selection.map(function(entity) {
          return <OriginEntityComponent entity={entity} key={entity.id} />
        })
      }
    </div>;
  }
}

export default OriginToolComponent;