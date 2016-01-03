import './index.scss';
import React from 'react';


class OriginEntityComponent extends React.Component {
  render() {

    var rect  = this.props.entity.preview.getBoundingRect();
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

    var eleft = (rect.left + rect.width / 2);
    var etop  = (rect.top + rect.height / 2);
    var sleft = (ostyle.left + ostyle.width / 2);
    var stop  = (ostyle.top + ostyle.height / 2);
    var swidth = eleft - sleft + 1;
    var sheight = etop - stop + 1;

    var d = [
      'M' + 0 + ' ' + 0,
      'L' + swidth + ' ' + sheight
    ];

    return <div>
      <div style={ostyle} className='m-origin-preview-tool--entity'>

      </div>
      <svg style={{
        left: sleft,
        top : stop
      }} viewBox={[0, 0, swidth, sheight]} width={Math.abs(swidth)} height={Math.abs(sheight)}>
        <path d={d.join('')} stroke='#FF00FF' fill='transparent' />
      </svg>
    </div>
  }
}

class OriginToolComponent extends React.Component {
  render() {
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