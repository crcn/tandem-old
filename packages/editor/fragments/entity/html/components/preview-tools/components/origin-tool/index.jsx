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

    return <div style={ostyle} className='m-origin-preview-tool--entity'>

    </div>;
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