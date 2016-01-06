import './index.scss';
import React from 'react';

class EntityMarginComponent extends React.Component {
  render() {

    var entBounds = this.props.entity.preview.getBoundingRect(true);
    var element   = this.props.entity.preview.getDisplayElement();
    var calcStyle = this.props.entity.preview.getStyle(true);

    var margins = {
      left: calcStyle.marginLeft,
      top: calcStyle.marginTop,
      bottom: calcStyle.marginBottom,
      right: calcStyle.marginRight
    };

    var style = {
      left: entBounds.left + 1,
      top: entBounds.top + 1,
      width: entBounds.width,
      height: entBounds.height,
      borderLeftWidth: margins.left,
      borderTopWidth: margins.top,
      borderBottomWidth: margins.bottom,
      borderRightWidth: margins.right
    };

    return <div style={style} className='m-margin-preview-tool--entity'>
      <div className='m-margin-preview-tool--entity-clip'></div>
    </div>
  }
}

class MarginToolComponent extends React.Component {
  render() {
    var selection = this.props.selection;
    return <div className='m-margin-preview-tool'>
      {
        selection.map(function(entity) {
          return <EntityMarginComponent entity={entity} key={entity.id} />;
        })
      }
    </div>
  }
}

export default MarginToolComponent;