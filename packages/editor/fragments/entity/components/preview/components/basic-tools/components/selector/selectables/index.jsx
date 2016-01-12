import React from 'react';

class SelectableComponent extends React.Component {
  render() {

    var entity = this.props.entity;
    var bounds = entity.preview.getBoundingRect(true);

    var style = {
      background : '#F0F',
      position   : 'absolute',
      width      : bounds.width,
      height     : bounds.height,
      left       : bounds.left,
      top        : bounds.top
    };
    return <div style={style} />;
  }
}

class SelectablesComponent extends React.Component {
  render() {
    var currentLayerFocus = this.props.app.rootEntity;

    return <div>
      {
        currentLayerFocus.children.map(function(entity) {
          return <SelectableComponent entity={entity} key={entity.id} />
        })
      }
    </div>;
  }
}

export default SelectablesComponent;
