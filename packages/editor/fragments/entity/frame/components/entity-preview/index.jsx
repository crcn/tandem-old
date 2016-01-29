import './index.scss';
import React from 'react';
import RegisteredComponent from 'common/components/registered';

class FrameComponent extends React.Component {
  render() {

    var entity = this.props.entity;
    var style  = entity.getStyle() || {};

    var style = {
      top    : style.top,
      left   : style.left,
      width  : style.width,
      height : style.height
    };

    return <div className='m-frame' style={style}>
      <RegisteredComponent
      {...this.props}
      entity={entity}
      queryOne={'preview/' + entity.componentType } />
    </div>;
  }
}

class FramePreviewComponent extends React.Component {
  render() {

    var frameEntities = this.props.app.rootEntity.filter(function(entity) {
      return /frame/.test(entity.componentType);
    });


    return <div className='m-frame-preview'>
      {
        frameEntities.map((frameEntity) => {
          return <FrameComponent
            {...this.props}
            entity={frameEntity}
            key={frameEntity.id} />
        })
      }
    </div>;
  }
}

export default FramePreviewComponent;
