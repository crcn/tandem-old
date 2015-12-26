import './origin.scss';

import React from 'react';
import cx from 'classnames';

class OriginInputComponent extends React.Component {

  onSelectOrigin(x, y) {
    this.props.reference.setValue([x, y]);
  }

  render() {

    var ref    = this.props.reference;
    var [ox, oy] = ref.getValue();

    var s  = 23;
    var os = 5;
    var hs = os / 2;

    var boxes = [
      { x: 0   , y: 0   },  // NW
      { x: 1   , y: 0   },  // NE
      { x: 1   , y: 1   },  // SE
      { x: 0   , y: 1   },  // SW

      { x: 0.5 , y: 0.5 } // C
    ].map(function(box) {
      box.selected = box.x === ox && box.y === oy;
      return box;
    });

    return <div className='m-origin-input'>
      <svg width={s} height={s} viewBox={[0, 0, s + hs + os, s + os].join(' ')}>
        <rect className='m-origin-input--border' x={hs} y={hs} width={s} height={s} />
        {
          boxes.map(({ x, y, selected }) => {

            var classNames = cx({
              'm-origin-input--box' : true,
              'selected'      : selected
            });

            return <rect className={classNames} x={x * s} y={y * s} width={os} height={os} onClick={this.onSelectOrigin.bind(this, x, y)} />;
          })
        }
      </svg>
    </div>;
  }
}

export default OriginInputComponent;
