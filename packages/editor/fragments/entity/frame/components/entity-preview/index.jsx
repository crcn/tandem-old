import './index.scss';
import React from 'react';
import FramePreview from './preview';
import RegisteredComponent from 'common/components/registered';

class FrameComponent extends React.Component {

  componentDidMount() {
    this.props.entity.preview = FramePreview.create(
      this.props.entity,
      this
    );
  }

  render() {

    var entity = this.props.entity;
    var style  = entity.getStyle() || {};

    var previewableEntity = entity.find(function(child) {
      return /element/.test(child.componentType);
    });

    var style = {
      top    : style.top,
      left   : style.left,
      width  : style.width,
      height : style.height
    };

    return <div ref='frame' className='m-frame' style={style}>
      <RegisteredComponent
      {...this.props}
      entity={previewableEntity}
      queryOne={'preview/' + previewableEntity.componentType } />
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
